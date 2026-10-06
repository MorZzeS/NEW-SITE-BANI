import test from 'node:test'
import assert from 'node:assert/strict'
import { handleLead } from './worker.mjs'
const lead = { requestId: 'worker-test-00000001', name: 'Тест', phone: '+7 936 200-00-50', model: '', comment: '', page: 'https://morzzes.github.io/NEW-SITE-BANI/', consent: true, website: '', startedAt: Date.now() - 5000 }
function setup() {
 const seen = new Map()
 const gate = { fetch: async (_, init) => {
  const { action, requestId } = JSON.parse(init.body)
  if (action === 'complete') { seen.set(requestId, true); return Response.json({ status: 200 }) }
  if (seen.has(requestId)) return Response.json({ status: seen.get(requestId) ? 200 : 409 })
  seen.set(requestId, false); return Response.json({ status: 201 })
 } }
 return { MAX_BOT_TOKEN: 'mock-only', MAX_USER_ID: '2758798', ALLOWED_ORIGINS: 'https://morzzes.github.io', LEAD_GATE: { idFromName: v => v, get: () => gate } }
}
const req = (data = lead, origin = 'https://morzzes.github.io') => new Request('https://worker.example/leads', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' }, body: JSON.stringify(data) })
test('Worker success receipt, user target, CORS and duplicate suppression', async () => {
 const env = setup(); let calls = 0
 const upstream = async (url, init) => { calls++; assert.equal(url, 'https://platform-api2.max.ru/messages?user_id=2758798'); assert.equal(init.headers.Authorization, 'mock-only'); return Response.json({ message: { body: { mid: 'test' } } }) }
 const response = await handleLead(req(), env, upstream)
 assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true, requestId: lead.requestId })
 assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://morzzes.github.io')
 assert.equal((await handleLead(req(), env, upstream)).status, 200); assert.equal(calls, 1)
 assert.equal((await handleLead(req(lead, 'https://untrusted.invalid'), env, upstream)).status, 403)
 assert.equal((await handleLead(req({ ...lead, consent: false }), env, upstream)).status, 400)
 assert.equal((await handleLead(req({ ...lead, page: 'https://morzzes.github.io/other' }), env, upstream)).status, 400)
})
test('Worker rejects missing secret and unconfirmed upstream; uncertain retries blocked', async () => {
 assert.equal((await handleLead(req(), { ...setup(), MAX_BOT_TOKEN: '' })).status, 503)
 for (const upstream of [async () => new Response('', { status: 401 }), async () => Response.json({}), async () => { throw new Error('timeout') }]) {
  const env = setup()
  const response = await handleLead(req(), env, upstream)
  assert.equal(response.status, 502); assert.equal((await response.json()).ok, false)
  assert.equal((await handleLead(req(), env, upstream)).status, 409)
 }
})
