import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
const code = ts.transpileModule(fs.readFileSync('src/lib/leads.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
function api(endpoint, fetchImpl) {
  const exports = {}
  vm.runInNewContext(code, { exports, process: { env: { NEXT_PUBLIC_LEADS_ENDPOINT: endpoint } }, fetch: fetchImpl, AbortController, setTimeout, clearTimeout })
  return exports
}
const lead = { requestId: 'test-id' }
await assert.rejects(api('', () => {}).sendLead(lead), /не настроена/)
await api('https://test.invalid/leads', async () => ({ ok: true, json: async () => ({ ok: true, requestId: 'test-id' }) })).sendLead(lead)
await assert.rejects(api('https://test.invalid/leads', async () => ({ ok: false, json: async () => ({ ok: false }) })).sendLead(lead), /Не удалось/)
await assert.rejects(api('https://test.invalid/leads', async () => ({ ok: true, json: async () => ({ ok: true, requestId: 'other' }) })).sendLead(lead), /Не удалось/)
await assert.rejects(api('https://test.invalid/leads', async () => { const e = new Error('Timeout'); e.name = 'AbortError'; throw e }).sendLead(lead), /Время ожидания/)
console.log('PASS: disabled configuration, confirmed success, errors, request receipt and timeout; no real messages sent.')
