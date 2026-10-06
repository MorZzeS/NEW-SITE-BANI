import test from 'node:test'
import assert from 'node:assert/strict'
import { createLeadServer, validateLead } from './leads-server.mjs'
const lead = { requestId: 'test-request-00000001', name: 'Тест', phone: '+7 936 200-00-50', model: 'Исток 4', page: 'https://banger.su/banya/istok-4', comment: 'Проверка', consent: true, website: '', startedAt: Date.now() - 5000 }
test('validation rejects honeypot, invalid phone and no consent', () => {
  assert.equal(validateLead(lead), true)
  for (const data of [{ ...lead, website: 'spam' }, { ...lead, phone: '123' }, { ...lead, consent: false }, { ...lead, startedAt: Date.now() }]) assert.equal(validateLead(data), false)
})
test('staging root and trusted proxy client IPs are supported', async () => {
  const server = createLeadServer({ env: { ALLOWED_ORIGINS: 'https://morzzes.github.io', MAX_BOT_TOKEN: 'test-only', MAX_CHAT_ID: '1', TRUST_PROXY: '1' }, fetchImpl: async () => ({ ok: true, json: async () => ({ message: { body: { mid: 'test' } } }) }) })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${server.address().port}/leads`
  try {
    for (let i = 1; i <= 6; i++) {
      const result = await fetch(url, { method: 'POST', headers: { Origin: 'https://morzzes.github.io', 'Content-Type': 'application/json', 'X-Forwarded-For': `192.0.2.${i}` }, body: JSON.stringify({ ...lead, requestId: `proxy-request-0000000${i}`, page: 'https://morzzes.github.io/NEW-SITE-BANI' }) })
      assert.equal(result.status, 200)
    }
    const wrong = await fetch(url, { method: 'POST', headers: { Origin: 'https://morzzes.github.io', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...lead, page: 'https://morzzes.github.io/unrelated-project' }) })
    assert.equal(wrong.status, 400)
  } finally { await new Promise(resolve => server.close(resolve)) }
})
test('HTTP contract, idempotency, CORS, rate limit and failed delivery', async () => {
  let calls = 0
  const server = createLeadServer({ env: { ALLOWED_ORIGINS: 'https://banger.su', MAX_BOT_TOKEN: 'test-only-not-a-secret', MAX_CHAT_ID: '1' }, fetchImpl: async (url, init) => {
    calls++
    assert.equal(url.hostname, 'platform-api2.max.ru')
    assert.equal(init.headers.Authorization, 'test-only-not-a-secret')
    return { ok: true, json: async () => ({ message: { body: { mid: 'test' } } }) }
  } })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${server.address().port}/leads`
  const send = (data, origin = 'https://banger.su') => fetch(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  try {
    assert.equal((await send(lead, 'https://untrusted.invalid')).status, 403)
    assert.equal((await send({ ...lead, phone: '123' })).status, 400)
    assert.equal((await send(lead)).status, 200)
    assert.equal((await send(lead)).status, 200)
    assert.equal(calls, 1)
    for (let i = 2; i <= 5; i++) assert.equal((await send({ ...lead, requestId: `test-request-0000000${i}` })).status, 200)
    assert.equal((await send({ ...lead, requestId: 'test-request-00000006' })).status, 429)
  } finally { await new Promise(resolve => server.close(resolve)) }
  const failed = createLeadServer({ env: { ALLOWED_ORIGINS: 'https://banger.su', MAX_BOT_TOKEN: 'test-only', MAX_USER_ID: '1' }, fetchImpl: async () => { throw new Error('timeout') } })
  await new Promise(resolve => failed.listen(0, '127.0.0.1', resolve))
  try {
    const response = await fetch(`http://127.0.0.1:${failed.address().port}/leads`, { method: 'POST', headers: { Origin: 'https://banger.su', 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
    assert.equal(response.status, 502)
    assert.equal((await response.json()).ok, false)
  } finally { await new Promise(resolve => failed.close(resolve)) }
})
