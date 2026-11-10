import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import './lead-artifact-gate.test.mjs'

const source = readFileSync(new URL('../src/lib/lead-release-gate.ts', import.meta.url), 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const module = { exports: {} }
new Function('exports', 'require', 'module', output)(module.exports, () => { throw new Error('Unexpected import') }, module)
const { isOnlineLeadReleaseReady } = module.exports
const validDocument = Object.freeze({ version: 'reviewed-v1', text: 'Reviewed exact text', sha256: 'a'.repeat(64) })
const validBundle = Object.freeze({ approved: true, documents: Object.freeze({ consent: validDocument, checkbox: validDocument, policy: validDocument }) })
const endpoint = 'https://banger.su/leads.php'
const cases = [
  ['missing endpoint', undefined, '3', validBundle, false],
  ['http endpoint', 'http://banger.su/leads.php', '3', validBundle, false],
  ['endpoint only', endpoint, undefined, validBundle, false],
  ['legacy contract', endpoint, '1', validBundle, false],
  ['unapproved bundle', endpoint, '3', { ...validBundle, approved: false }, false],
  ['missing bundle', endpoint, '3', null, false],
  ['missing document', endpoint, '3', { approved: true, documents: { consent: validDocument, checkbox: validDocument } }, false],
  ['invalid document hash', endpoint, '3', { approved: true, documents: { consent: validDocument, checkbox: validDocument, policy: { ...validDocument, sha256: 'bad' } } }, false],
  ['unexpected document', endpoint, '3', { approved: true, documents: { ...validBundle.documents, extra: validDocument } }, false],
  ['endpoint credentials', 'https://user:pass@banger.su/leads.php', '3', validBundle, false],
  ['endpoint query', endpoint + '?token=placeholder', '3', validBundle, false],
  ['endpoint fragment', endpoint + '#submit', '3', validBundle, false],
  ['unapproved host', 'https://evil.example/leads.php', '3', validBundle, false],
  ['www host', 'https://www.banger.su/leads.php', '3', validBundle, false],
  ['unapproved path', 'https://banger.su/collect', '3', validBundle, false],
  ['non-standard port', 'https://banger.su:8443/leads.php', '3', validBundle, false],
  ['endpoint root', 'https://banger.su/', '3', validBundle, false],
  ['complete reviewed configuration', endpoint, '3', validBundle, true],
]
for (const [name, url, contract, bundle, expected] of cases) assert.equal(isOnlineLeadReleaseReady(url, contract, bundle), expected, name)
console.log(`Online lead activation gate: ${cases.length} cases PASS`)
