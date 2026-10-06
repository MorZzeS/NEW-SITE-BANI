import { validateLead } from './lead-validation.mjs'

// Persistent, atomic admission across Worker isolates. Only hashes/receipt IDs stored.
export class LeadGate {
  constructor(state) { this.state = state }
  async fetch(request) {
    const { action, requestId, ipHash } = await request.json()
    const now = Date.now(), key = `request:${requestId}`
    const result = await this.state.storage.transaction(async storage => {
      if (action === 'complete') {
        await storage.put(key, { done: true, expires: now + 86400000 })
        return { status: 200 }
      }
      const prior = await storage.get(key)
      if (prior && prior.expires > now) return { status: prior.done ? 200 : 409 }
      const rateKey = `rate:${ipHash}`
      const existing = await storage.get(rateKey)
      const rate = existing && existing.expires > now ? existing : { count: 0, expires: now + 600000 }
      if (rate.count >= 5) return { status: 429 }
      rate.count++
      await storage.put(rateKey, rate)
      await storage.put(key, { done: false, expires: now + 86400000 })
      return { status: 201 }
    })
    if (!await this.state.storage.getAlarm()) await this.state.storage.setAlarm(now + 600000)
    return Response.json(result)
  }
  async alarm() {
    const entries = await this.state.storage.list()
    const expired = [...entries].filter(([, value]) => value.expires <= Date.now()).map(([key]) => key)
    for (let i = 0; i < expired.length; i += 128) await this.state.storage.delete(expired.slice(i, i + 128))
    if (entries.size > expired.length) await this.state.storage.setAlarm(Date.now() + 600000)
  }
}

export async function handleLead(request, env, fetchImpl = fetch) {
  const origin = request.headers.get('Origin')
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(v => v.trim())
  const headers = { 'Cache-Control': 'no-store', Vary: 'Origin' }
  const reply = (status, value = { ok: false }) => Response.json(value, { status, headers })
  if (!origin || !allowed.includes(origin)) return reply(403)
  headers['Access-Control-Allow-Origin'] = origin
  if (new URL(request.url).pathname !== '/leads') return reply(404)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } })
  if (request.method !== 'POST') return reply(404)
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415)
  let data
  try {
    let size = 0
    const chunks = []
    const reader = request.body?.getReader()
    if (!reader) return reply(400)
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 8192) { await reader.cancel(); return reply(413) }
      chunks.push(value)
    }
    const body = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length }
    data = JSON.parse(new TextDecoder().decode(body))
    if (!validateLead(data)) return reply(400)
    const page = new URL(data.page)
    if (page.origin !== origin || (origin === 'https://morzzes.github.io' && page.pathname !== '/NEW-SITE-BANI' && !page.pathname.startsWith('/NEW-SITE-BANI/'))) return reply(400)
  } catch { return reply(400) }
  if (!env.MAX_BOT_TOKEN || env.MAX_USER_ID !== '2758798' || !env.LEAD_GATE) return reply(503)
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
    const ipHash = Array.from(new Uint8Array(hash), v => v.toString(16).padStart(2, '0')).join('')
    const gate = env.LEAD_GATE.get(env.LEAD_GATE.idFromName('leads'))
    const callGate = async action => (await gate.fetch('https://internal/', { method: 'POST', body: JSON.stringify({ action, requestId: data.requestId, ipHash }) })).json()
    const admission = await callGate('reserve')
    if (admission.status !== 201) return reply(admission.status, { ok: admission.status === 200, requestId: data.requestId })
    const text = `Новая заявка BANGER.SU\nИмя: ${data.name.trim()}\nТелефон: ${data.phone}\nМодель: ${data.model || 'Не указана'}\nСтраница: ${data.page}\nКомментарий: ${data.comment || 'Нет'}\nДата: ${new Date().toISOString()}\nID: ${data.requestId}`
    const response = await fetchImpl('https://platform-api2.max.ru/messages?user_id=2758798', { method: 'POST', headers: { Authorization: env.MAX_BOT_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(10000) })
    if (!response.ok) { console.error('MAX upstream HTTP status', response.status); return reply(502) }
    if (!(await response.json()).message) { console.error('MAX missing delivery receipt'); return reply(502) }
    await callGate('complete')
    return reply(200, { ok: true, requestId: data.requestId })
  } catch (error) { console.error('MAX delivery failure', error instanceof Error ? error.name : 'UnknownError'); return reply(502) }
}
export default { fetch(request, env) { return handleLead(request, env) } }
