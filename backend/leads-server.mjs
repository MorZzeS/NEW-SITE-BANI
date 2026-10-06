import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'
import { isIP } from 'node:net'

export function validateLead(data, now = Date.now()) {
  if (!data || typeof data !== 'object') return false
  const bounded = (key, min, max) => typeof data[key] === 'string' && data[key].trim().length >= min && data[key].length <= max
  return bounded('requestId', 16, 80) && /^[\w-]+$/.test(data.requestId) && bounded('name', 2, 80) &&
    bounded('phone', 10, 30) && /^\+?[\d ()-]+$/.test(data.phone) && /^[78]\d{10}$/.test(data.phone.replace(/\D/g, '')) &&
    bounded('model', 0, 160) && bounded('comment', 0, 1500) && bounded('page', 8, 600) && data.consent === true &&
    data.website === '' && typeof data.startedAt === 'number' && now - data.startedAt >= 3000 && now - data.startedAt < 86400000
}

export function createLeadServer({ env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  const rate = new Map(), requests = new Map()
  const server = createServer(async (req, res) => {
    const origin = req.headers.origin
    const reply = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)) }
    if (!origin || !allowed.includes(origin)) return reply(403, { ok: false })
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'POST'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); res.writeHead(204); return res.end() }
    if (req.url !== '/leads' || req.method !== 'POST') return reply(404, { ok: false })
    if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { ok: false })
    let body = '', bytes = 0
    try {
      for await (const chunk of req) { bytes += chunk.length; if (bytes > 8192) return reply(413, { ok: false }); body += chunk }
      const data = JSON.parse(body)
      if (!validateLead(data, now())) return reply(400, { ok: false })
      const page = new URL(data.page)
      const stagingPath = page.pathname === '/NEW-SITE-BANI' || page.pathname.startsWith('/NEW-SITE-BANI/')
      if (page.origin !== origin || (origin === 'https://morzzes.github.io' && !stagingPath)) return reply(400, { ok: false })
      for (const [key, value] of requests) if (now() - value.at > 600000) requests.delete(key)
      for (const [key, value] of rate) if (now() - value.at > 600000) rate.delete(key)
      const prior = requests.get(data.requestId)
      if (prior) return reply(prior.done ? 200 : 409, { ok: prior.done, requestId: data.requestId })
      const remote = req.socket.remoteAddress
      const forwarded = String(req.headers['x-forwarded-for'] || '').split(',').at(-1)?.trim()
      const trustedProxy = env.TRUST_PROXY === '1' && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote)
      const ip = trustedProxy && forwarded && isIP(forwarded) ? forwarded : remote
      const entry = rate.get(ip) || { count: 0, at: now() }
      if (++entry.count > 5 || rate.size > 10000 || requests.size > 10000) return reply(429, { ok: false })
      rate.set(ip, entry)
      if (!env.MAX_BOT_TOKEN || !(env.MAX_CHAT_ID || env.MAX_USER_ID)) return reply(503, { ok: false })
      requests.set(data.requestId, { at: now(), done: false })
      const target = new URL('https://platform-api2.max.ru/messages')
      target.searchParams.set(env.MAX_CHAT_ID ? 'chat_id' : 'user_id', env.MAX_CHAT_ID || env.MAX_USER_ID)
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 10000)
      try {
        const text = `Новая заявка BANGER.SU\nИмя: ${data.name.trim()}\nТелефон: ${data.phone}\nМодель: ${data.model || 'Не указана'}\nСтраница: ${data.page}\nКомментарий: ${data.comment || 'Нет'}\nДата: ${new Date(now()).toISOString()}\nID: ${data.requestId}`
        const response = await fetchImpl(target, { method: 'POST', headers: { Authorization: env.MAX_BOT_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: controller.signal })
        if (!response.ok) throw new Error('MAX delivery failed')
        const result = await response.json()
        if (!result.message) throw new Error('MAX delivery not confirmed')
        requests.set(data.requestId, { at: now(), done: true })
        reply(200, { ok: true, requestId: data.requestId })
      } catch { reply(502, { ok: false }) } finally { clearTimeout(timeout) }
    } catch { reply(400, { ok: false }) }
  })
  server.requestTimeout = 20000
  return server
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) createLeadServer().listen(Number(process.env.PORT || 8787), '127.0.0.1')
