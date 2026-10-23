import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import { createHash, webcrypto } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Synthetic words only: these are not legal documents and never enter the production bundle.
export function syntheticBundle(version = 'synthetic-v1') {
  const documents = Object.fromEntries(['consent', 'checkbox', 'policy'].map(kind => {
    const text = `SYNTHETIC TEST ONLY — ${kind}\n${version}\nExact UTF-8: ё, quotation “text”.`
    return [kind, { version: `${kind}-${version}`, text, sha256: createHash('sha256').update(text, 'utf8').digest('hex') }]
  }))
  return { approved: true, documents }
}
export function memoryStorage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), values }
}
export function loadFrontend({ bundle = syntheticBundle(), env = {}, storage = memoryStorage(), fetch: fetchImpl = () => { throw new Error('Unexpected network') }, timers = {}, protocol = 'https:' } = {}) {
  const cache = new Map()
  function load(file) {
    const absolute = path.resolve(file)
    if (cache.has(absolute)) return cache.get(absolute)
    if (absolute.endsWith(`${path.sep}lead-documents.ts`)) return { leadDocumentBundle: bundle }
    const exports = {}
    cache.set(absolute, exports)
    const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
    vm.runInNewContext(source, { exports, process: { env: { NEXT_PUBLIC_LEADS_CONTRACT: '3', NEXT_PUBLIC_LEADS_ENDPOINT: 'https://synthetic.invalid/leads', ...env } },
      require: id => load(path.resolve(path.dirname(absolute), `${id}.ts`)), URL, TextEncoder, TextDecoder, crypto: webcrypto, location: { protocol }, window: {}, sessionStorage: storage,
      fetch: fetchImpl, AbortController, setTimeout, clearTimeout, ...timers }, { filename: absolute })
    return exports
  }
  return { consent: load('src/lib/lead-consent.ts'), leads: load('src/lib/leads.ts'), attempts: load('src/lib/lead-attempt.ts'), storage, load }
}
export function syntheticLead(consent) {
  return { requestId: 'synthetic-request-0001', name: 'Synthetic Person', phone: '+7 900 000-00-00', model: 'Synthetic Model', comment: 'Выбранные дополнительные опции:\n• Synthetic option\n\nSynthetic comment', page: 'https://synthetic.invalid/model', createdAt: new Date().toISOString(), startedAt: Date.now() - 5000, consent: true, website: '', ...consent.consentEvidence() }
}
export function receiptFor(lead) {
  const { contractVersion, requestId, purposeCode, action, consent, page, consentVersion, policyVersion, consentTextSha256, checkboxTextSha256, policyTextSha256 } = lead
  return { contractVersion, requestId, purposeCode, action, consent, page, consentVersion, policyVersion, consentTextSha256, checkboxTextSha256, policyTextSha256, receiptId: '00000000-0000-4000-8000-000000000001', receivedAt: new Date().toISOString() }
}
const response = (lead, status, options = {}) => ({ status: status==='sent'?200:status==='storage_unavailable'?503:status==='rejected'?400:409, ok: status === 'sent', json: async () => ({ ok: status === 'sent', contractVersion: 3, requestId: lead.requestId, status, admitted: true, retryable: false, ...(['sent', 'claimed', 'unknown'].includes(status) ? { receipt: receiptFor(lead) } : {}), ...options }) })

export async function verifyConsentIntegration() {
  let calls = 0
  for (const bundle of [{ approved: false, documents: null }, { ...syntheticBundle(), approved: false }, { ...syntheticBundle(), documents: { ...syntheticBundle().documents, policy: { ...syntheticBundle().documents.policy, text: 'tampered' } } }]) {
    const api = loadFrontend({ bundle, fetch: () => { calls++ } })
    const lead = bundle.approved ? syntheticLead(api.consent) : { contractVersion: 3 }
    await assert.rejects(api.leads.sendLead(lead)); assert.equal(calls, 0)
  }
  const approved = loadFrontend()
  assert.equal(approved.consent.leadContract, 3)
  assert.equal(approved.consent.consentEvidenceReady, true)
  assert.equal(JSON.stringify(await approved.consent.verifyLeadDocumentBundle()), JSON.stringify(approved.consent.leadDocumentBundle.documents))
  const valid = syntheticBundle()
  for (const malformed of [
    { approved: 'true', documents: valid.documents }, { approved: true, documents: {} },
    { approved: true, documents: { consent: valid.documents.consent, checkbox: valid.documents.checkbox } },
    { approved: true, documents: { ...valid.documents, other: valid.documents.policy } },
    { approved: true, documents: { ...valid.documents, policy: null } },
    { approved: true, documents: { ...valid.documents, policy: { ...valid.documents.policy, text: 123 } } },
    { approved: true, documents: { ...valid.documents, policy: { ...valid.documents.policy, text: '\ud800', sha256: createHash('sha256').update('\ud800').digest('hex') } } },
  ]) {
    const api = loadFrontend({ bundle: malformed, fetch: () => { calls++ } })
    await assert.rejects(api.consent.verifyLeadDocumentBundle())
    await assert.rejects(api.leads.sendLead(syntheticLead(approved.consent)))
    assert.equal(calls, 0)
  }
  assert.equal(approved.consent.leadPageUrl('https://synthetic.invalid/model?phone=private#secret'), 'https://synthetic.invalid/model')
  for (const alteration of [{ consent: false }, { checkboxVersion: 'wrong-version' }, { consentTextSha256: '0'.repeat(64) }, { contractVersion: 2 }]) {
    const api = loadFrontend({ fetch: () => { calls++ } })
    await assert.rejects(api.leads.sendLead({ ...syntheticLead(api.consent), ...alteration })); assert.equal(calls, 0)
  }
  const bodies = []
  const success = loadFrontend({ fetch: async (_, options) => { const lead = JSON.parse(options.body); bodies.push(lead); assert.equal(options.credentials, 'omit'); return response(lead, 'sent') } })
  const lead = syntheticLead(success.consent)
  await success.leads.sendLead(lead)
  assert.deepEqual(bodies[0], lead)
  assert.equal(success.attempts.leadAttemptMarker().state, 'sent')
  await assert.rejects(success.leads.sendLead({ ...lead, requestId: 'new-request-0000001', model: 'changed' }))
  assert.equal(bodies.length, 1)
  const marker = JSON.parse([...success.storage.values.values()][0])
  assert.deepEqual(Object.keys(marker).sort(), ['requestId', 'state'])
  assert.equal(marker.requestId, lead.requestId)
  let retries = 0
  const retry = loadFrontend({ fetch: async (_, options) => {
    const current = JSON.parse(options.body); retries++
    assert.deepEqual(current, original)
    return retries === 1 ? response(current, 'storage_unavailable', { admitted: false, retryable: true }) : retries===2 ? { ...response(current, 'rejected', { admitted: false, retryable: true }), status: 429 } : response(current, 'sent')
  } })
  const original = syntheticLead(retry.consent)
  await assert.rejects(retry.leads.sendLead(original), error => error.state === 'rejected' && error.retryable)
  assert.equal(retry.attempts.leadAttemptMarker(), undefined)
  await assert.rejects(retry.leads.sendLead({ ...original, model: 'changed' }))
  assert.equal(retries, 1)
  await assert.rejects(retry.leads.sendLead({ ...original, requestId: 'ignored-new-request-0001', createdAt: new Date().toISOString(), startedAt: Date.now() }), error=>error.state==='rejected' && error.retryable)
  await retry.leads.sendLead({ ...original, requestId: 'ignored-new-request-0002', createdAt: new Date().toISOString(), startedAt: Date.now() })
  assert.equal(retries, 3)
  let correctedCalls = 0
  const correction = loadFrontend({ fetch: async (_, options) => {
    const current = JSON.parse(options.body); correctedCalls++
    return correctedCalls === 1 ? response(current, 'rejected', { admitted: false, retryable: false }) : response(current, 'sent')
  } })
  const incorrect = syntheticLead(correction.consent)
  await assert.rejects(correction.leads.sendLead(incorrect), error => error.state === 'rejected' && !error.retryable)
  assert.equal(correction.attempts.discardRejectedLeadAttempt(), true)
  await correction.leads.sendLead({ ...incorrect, model: 'Explicit corrected model', requestId: 'synthetic-corrected-0001' })
  assert.equal(correctedCalls, 2)
  for (const makeResponse of [
    current => response(current, 'claimed'), current => response(current, 'unknown'), current => response(current, 'conflict'),
    current => response(current, 'sent', { requestId: 'mismatched-request' }),
    current => response(current, 'sent', { receipt: { ...receiptFor(current), policyTextSha256: '0'.repeat(64) } }),
    current => response(current, 'sent', { receipt: null }),
    current => response(current, 'sent', { admitted: false, retryable: true }),
    current => response(current, 'sent', { receipt: { ...receiptFor(current), name: 'UNEXPECTED_PII' } }),
    current => response(current, 'sent', { receipt: { ...receiptFor(current), receiptId: 'not-a-uuid' } }),
    current => response(current, 'sent', { receipt: { ...receiptFor(current), receivedAt: '2026-10-21' } }),
    current => response(current, 'sent', { extra: 'unrecognized-field' }),
    current => ({ ...response(current, 'storage_unavailable', { admitted: false, retryable: true }), status: 500 }),
    current => ({ ...response(current, 'rejected', { admitted: false, retryable: false }), status: 409 }),
    current => response(current, 'storage_unavailable', { admitted: false, retryable: false }),
    current => response(current, 'unknown', { admitted: false, retryable: true }),
    current => ({ ok: false, json: async () => ({ ok: false, contractVersion: 3, requestId: current.requestId, status: 'sent', admitted: false, retryable: true }) }),
    () => ({ ok: false, json: async () => ({ ok: false }) }),
    () => { const error = new Error('timeout'); error.name = 'AbortError'; throw error },
    () => { throw new Error('disconnected') },
  ]) {
    let count = 0
    const api = loadFrontend({ fetch: async (_, options) => { count++; return makeResponse(JSON.parse(options.body)) } })
    const candidate = syntheticLead(api.consent)
    await assert.rejects(api.leads.sendLead(candidate), error => ['unknown', 'claimed', 'conflict'].includes(error.state))
    assert.ok(api.attempts.leadAttemptMarker())
    assert.equal(api.attempts.discardRejectedLeadAttempt(), false)
    await assert.rejects(api.leads.sendLead({ ...candidate, requestId: 'edited-request-000001', phone: '+7 999 999-99-99' }))
    assert.equal(count, 1)
    const reloaded = loadFrontend({ storage: api.storage, fetch: () => { count++ } })
    await assert.rejects(reloaded.leads.sendLead(syntheticLead(reloaded.consent)))
    assert.equal(count, 1)
  }
  const blockedStorage = loadFrontend({ storage: { getItem: () => null, setItem: () => { throw new Error('blocked') } }, fetch: () => { calls++ } })
  await assert.rejects(blockedStorage.leads.sendLead(syntheticLead(blockedStorage.consent)), /хранилищу/); assert.equal(calls, 0)
  let aborted = false
  const timerAbort = loadFrontend({ timers: { setTimeout: callback => { queueMicrotask(callback); return 1 }, clearTimeout: () => {} }, fetch: (_, options) => new Promise((_, reject) => {
    options.signal.addEventListener('abort', () => { aborted = true; const error = new Error('synthetic timer abort'); error.name = 'AbortError'; reject(error) }, { once: true })
  }) })
  await assert.rejects(timerAbort.leads.sendLead(syntheticLead(timerAbort.consent)), error=>error.state==='unknown')
  assert.equal(aborted, true);assert.ok(timerAbort.attempts.leadAttemptMarker())
  const oldContract = loadFrontend({ env: { NEXT_PUBLIC_LEADS_CONTRACT: '2' } }).consent
  assert.equal(oldContract.leadContract, 2)
  assert.equal(oldContract.consentEvidenceReady, false)
  console.log('PASS: v3 unapproved/tampered bundle and refusal block fetch; matching receipt only; exact model/options payload; frozen same-ID pre-admission retry; ambiguous/mismatched/storage responses block retry and reload; session marker has no PII. Synthetic fetch only.')
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await verifyConsentIntegration()
