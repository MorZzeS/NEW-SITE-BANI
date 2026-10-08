import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
import { validateLead } from '../backend/lead-validation.mjs'
function load(file, requireModule, scope = {}) {
  const exports = {}
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText
  vm.runInNewContext(code, { exports, require: requireModule, ...scope })
  return exports
}
const source = load('src/data/options.ts')
const selection = load('src/lib/equipment-selection.ts', id => { assert.equal(id, '@/data/options'); return source })
const ids = source.additionalOptions.filter(o => o.enabled).map(o => o.id)
assert.equal(ids.length, 19)
assert.equal(selection.equipmentSelection([...ids, ...ids, 'invalid']).selected.length, 19)
assert.equal(selection.equipmentSelection(ids).knownTotal, source.additionalOptions.filter(o => o.enabled).reduce((sum, o) => sum + (o.salePrice ?? 0), 0))
const pair = selection.equipmentSelection(['boiler', 'tray', 'boiler'])
assert.equal(pair.selected.length, 2); assert.equal(pair.knownTotal, 32500); assert.equal(pair.unpricedCount, 1)
assert.equal(selection.equipmentSelection([]).comment, '')
assert.equal(selection.mergeConfigurationComment('Мой комментарий'), 'Мой комментарий')
assert.throws(() => selection.mergeConfigurationComment('x'.repeat(1500), pair.comment), /1500/)
let clock = Date.now(), stateIndex = 0, sent = []
const states = ['idle', '', 'Тест', '+79000000000', 'БГ-01', 'Мои пожелания', true]
const react = { useState: value => [states[stateIndex++] ?? value, () => {}], useEffect: () => {}, useRef: value => ({ current: value }) }
const jsx = (type, props) => ({ type, props })
class TestDate extends Date { static now() { return clock } }
const formModule = load('src/components/forms/CTAFormInline.tsx', id => {
  if (id === 'react') return react
  if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx }
  if (id === 'next/link') return { default: 'a' }
  if (id === '@/data') return { siteSettings: {} }
  if (id === '@/lib/equipment-selection') return selection
  if (id === '@/lib/leads') return { leadEndpoint: 'https://test.invalid/leads', sendLead: async lead => { sent.push(lead) } }
  throw new Error(id)
}, { Date: TestDate, location: { href: 'https://banger.su/komplektaciya', search: '' }, crypto: { randomUUID: () => 'equipment-test-request-01' }, FormData: class { get() { return '' } } })
function findForm(node) {
  if (!node || typeof node !== 'object') return undefined
  if (node.type === 'form') return node
  for (const child of [node.props?.children].flat(Infinity)) { const found = findForm(child); if (found) return found }
}
const tree = formModule.CTAFormInline({ configurationNote: selection.equipmentSelection(ids).comment })
clock += 5000
await findForm(tree).props.onSubmit({ preventDefault() {}, currentTarget: {} })
assert.equal(sent.length, 1)
assert.equal(sent[0].comment, selection.mergeConfigurationComment('Мои пожелания', selection.equipmentSelection(ids).comment))
for (const option of source.additionalOptions.filter(o => o.enabled)) assert(sent[0].comment.includes(option.name))
assert(validateLead(sent[0], clock))
stateIndex = 0
const ordinaryForm = formModule.CTAFormInline({})
clock += 5000
await findForm(ordinaryForm).props.onSubmit({ preventDefault() {}, currentTarget: {} })
assert.equal(sent.length, 2)
assert.equal(sent[1].comment, 'Мои пожелания')
stateIndex = 0; states[5] = 'x'.repeat(1500)
const tooLong = formModule.CTAFormInline({ configurationNote: pair.comment })
clock += 5000
await findForm(tooLong).props.onSubmit({ preventDefault() {}, currentTarget: {} })
assert.equal(sent.length, 2, 'overflow must not send or silently truncate')
console.log(`PASS: 19/19 options, canonical prices, deduplication, unknown price, reset, comment limit; real form submit payload passes unchanged backend validation (${sent[0].comment.length}/1500 chars). No real requests sent.`)
