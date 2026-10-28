import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'
import { isIP } from 'node:net'
import { createHmac } from 'node:crypto'
import { isAbsolute } from 'node:path'
import { openSync, closeSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs'
import { DurableStore } from './durable-store.mjs'

export function createMaxNotifier(env, fetchImpl = fetch) {
  const recipient = env.TEST_MODE === '1' ? env.TEST_MAX_USER_ID : env.MAX_USER_ID
  if (!env.MAX_BOT_TOKEN || !/^\d+$/.test(recipient || '')) throw new Error('Explicit MAX token and recipient required')
  return async (lead, signal) => {
    const target = new URL('https://platform-api2.max.ru/messages'); target.searchParams.set('user_id',recipient)
    const text = `Новая заявка BANGER.SU\nИмя: ${lead.name}\nТелефон: ${lead.phone}\nМодель: ${lead.model}\nАртикул: ${lead.article}\nТип: ${lead.modelKind}\nИсточник: ${lead.source}\nКонфигурация: ${lead.configuration}\nАкция: ${lead.promotion}\nКомментарий: ${lead.comment}\nСтраница: ${lead.page}\nID: ${lead.requestId}`
    const result = await fetchImpl(target,{method:'POST',headers:{Authorization:env.MAX_BOT_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({text:text+`\nПринято сервером: ${lead.receivedAt}`}),signal})
    if (result.status === 429) {
      const value = result.headers.get('retry-after')
      const retryAfterMs = /^\d+$/.test(value || '') ? Number(value)*1000 : Date.parse(value)-Date.now()
      return {status:'retry429',retryAfterMs}
    }
    if (result.status !== 200) return {status:'unknown'}
    const messageId = (await result.json())?.message?.body?.mid
    if (typeof messageId !== 'string' || !messageId.trim()) return {status:'unknown'}
    return {status:'sent',messageId}
  }
}
export function createDurableServer({env=process.env, notifier, now=Date.now}={}) {
  if (env.DURABLE_LEADS_ENABLED !== '1') throw new Error('Durable backend disabled')
  process.umask(0o077)
  const synthetic = env.SYNTHETIC_ONLY === '1'
  if (synthetic && !notifier) throw new Error('Synthetic mode requires injected notifier')
  if (!synthetic && ['RU_STORAGE_ATTESTED','LEGAL_APPROVAL_ATTESTED','BACKUP_RESTORE_ATTESTED'].some(k => env[k] !== '1')) throw new Error('Deployment attestations missing')
  if (!isAbsolute(env.LEADS_DB_PATH || '') || !isAbsolute(env.LEAD_DOCUMENT_BUNDLE || '')) throw new Error('Private absolute paths required')
  const origins = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  if (!origins.length || origins.some(o => {try {return new URL(o).origin !== o || !o.startsWith('https://')}catch{return true}})) throw new Error('Explicit HTTPS origins required')
  if (!synthetic && (typeof env.RATE_HMAC_KEY !== 'string' || env.RATE_HMAC_KEY.length < 32)) throw new Error('Private RATE_HMAC_KEY required')
  const notify = notifier || createMaxNotifier(env)
  const lockPath = env.LEADS_DB_PATH+'.lock'
  let fd
  try { fd = openSync(lockPath,'wx',0o600) } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const pid = Number(readFileSync(lockPath,'utf8'))
    if (!Number.isSafeInteger(pid) || pid <= 0) throw new Error('Invalid disk owner lock: operator review required')
    let alive = true
    try { process.kill(pid,0) } catch(e) { if(e.code === 'ESRCH') alive = false }
    if (alive) throw new Error('Durable disk already owned')
    unlinkSync(lockPath); fd = openSync(lockPath,'wx',0o600)
  }
  writeFileSync(fd,String(process.pid)); closeSync(fd)
  let store
  try { store = new DurableStore({path:env.LEADS_DB_PATH,bundlePath:env.LEAD_DOCUMENT_BUNDLE,now}) } catch(error) {unlinkSync(lockPath); throw error}
  const server = createServer(async (req,res) => {
    const reply = (status,body) => {res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(body))}
    if (req.url === '/health' && req.method === 'GET') return reply(200,{ok:true})
    const origin = req.headers.origin
    if (!origins.includes(origin)) return reply(403,{ok:false})
    res.setHeader('Access-Control-Allow-Origin',origin); res.setHeader('Vary','Origin')
    if (req.url !== '/leads') return reply(404,{ok:false})
    if (req.method === 'OPTIONS') {res.setHeader('Access-Control-Allow-Methods','POST'); res.setHeader('Access-Control-Allow-Headers','Content-Type'); res.writeHead(204); return res.end()}
    if (req.method !== 'POST') return reply(405,{ok:false})
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') return reply(415,{ok:false})
    let data
    try {
      const chunks=[]; let size=0
      for await (const chunk of req) {size+=chunk.length; if(size>16384) return reply(413,{ok:false}); chunks.push(chunk)}
      data=JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {return reply(400,{ok:false,contractVersion:3,requestId:'',status:'rejected',admitted:false,retryable:false})}
    const remote = req.socket.remoteAddress || 'unknown'
    const forwarded = req.headers['x-real-ip']
    const trusted = env.TRUST_LOOPBACK_PROXY === '1' && ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote)
    if (trusted && (typeof forwarded !== 'string' || !isIP(forwarded))) return reply(400,{ok:false})
    const ip = trusted ? forwarded : remote
    const ipKey = createHmac('sha256',env.RATE_HMAC_KEY || 'synthetic-only-key').update(ip).digest('hex')
    const result=store.admit(data,origin,ipKey); reply(result.http,result.body)
  })
  server.requestTimeout=20000; server.headersTimeout=10000
  let working=false
  const timer=setInterval(async()=>{if(working)return; working=true; try{await store.work(notify)}catch{console.error('Durable outbox storage error')}finally{working=false}},1000)
  timer.unref()
  server.once('close',()=>{clearInterval(timer); const finish=()=>{if(working){setTimeout(finish,50);return}store.close();unlinkSync(lockPath)};finish()})
  return {server,store}
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {server}=createDurableServer()
  server.listen(Number(process.env.PORT || 8788),'127.0.0.1')
  for(const signal of ['SIGTERM','SIGINT']) process.once(signal,()=>server.close())
}
