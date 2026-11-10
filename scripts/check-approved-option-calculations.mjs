import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const cache = new Map()
function load(file, overrides = {}, scope = {}) {
  if (!Object.keys(overrides).length && cache.has(file)) return cache.get(file)
  const exports = {}
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  vm.runInNewContext(code, { exports, require: id => {
    if (id in overrides) return overrides[id]
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`)
    throw Error(`Unexpected dependency ${id}`)
  }, ...scope }, { filename: file })
  if (!Object.keys(overrides).length) cache.set(file, exports)
  return exports
}
const plain = value => JSON.parse(JSON.stringify(value))
const { saunas, homes } = load('src/data/index.ts')
const { additionalOptions: options } = load('src/data/options.ts')
const { equipmentSelection, normalizeOptionQuantity, normalizeOptionIds, toggleEquipmentOption, optionQuantityLimit, optionQuantityLabel, stoveOptionIds } = load('src/lib/equipment-selection.ts')
const { calculateModelConfiguration: calculate, configurationManagerText } = load('src/lib/model-configuration-selection.ts')
const { modelOptionAvailability } = load('src/lib/model-option-availability.ts')
const option = id => options.find(item => item.id === id)
const confirmed = { 'outdoor-lamp': 7000, 'roof-overhang-light': 3500, 'hidden-wiring': 20000, 'wall-point': 9000, 'bench-light': 7000, 'floating-bench': 12000, 'aspen-bench': 7000, 'stove-fireproof-boards': 25000, 'wash-tap': 6000, 'panoramic-window-600-1800': 16000, 'steam-floor-oil': 12000, 'steam-lining-oil': 25000, 'lounge-floor-varnish': 20000, replanning: 10000, boiler: 37500, shower: 24500, led: 12000, 'steam-bench-oil': 15000 }
for (const [id, price] of Object.entries(confirmed)) assert.equal(option(id)?.salePrice, price, id)
const replacementRetail = { ermak: 17000, 'ermak-16-ps': 25000, 'ermak-16-premium-steel': 45000, 'ermak-16-premium-cast-iron': 66000 }
for (const [id, retail] of Object.entries(replacementRetail)) {
  assert.equal(option(id)?.salePrice, null, `${id}: full retail must not be charged as a replacement supplement`)
  assert.equal(option(id)?.confirmedRetailPrice, retail)
  assert.equal(option(id)?.priceStatus, 'replacement-pending')
  assert.ok(!('proposedRetailPrice' in option(id)), 'confirmed retail is no longer preliminary')
  const result = calculate(saunas[0], [id])
  assert.equal(result.optionsSubtotal, 0)
  assert.equal(result.unpricedCount, 1)
  assert.ok(!('confirmedRetailPrice' in result.options[0]), 'PDF/lead configuration must never expose the full retail as a replacement charge')
  assert.ok(!configurationManagerText(result).includes(retail.toLocaleString('ru-RU')))
}
for (const id of ['led', 'steam-bench-oil']) {
  assert.equal(option(id).enabled, true)
  assert.ok(!('priceStatus' in option(id)) && !('proposedRetailPrice' in option(id)), `${id}: final price must not retain preliminary metadata`)
}
assert.equal(equipmentSelection(['led', 'steam-bench-oil']).knownTotal, 27000)
assert.equal(equipmentSelection(['led', 'steam-bench-oil']).unpricedCount, 0)
for (const item of options.filter(item => item.priceUnit === 'шт.')) {
  assert.equal(optionQuantityLimit(item), 99)
  for (const [input, expected] of [[undefined, 1], [NaN, 1], [Infinity, 1], ['3', 1], [0, 0], [-3, 1], [3.9, 3], [500, 99]]) assert.equal(normalizeOptionQuantity(item, input), expected, `${item.id}: ${input}`)
  const qty = 3, result = equipmentSelection([item.id, item.id], { [item.id]: qty })
  assert.equal(result.selected.length, 1)
  assert.equal(result.selected[0].quantity, qty)
  assert.equal(result.knownTotal, item.salePrice * qty)
  assert.ok(result.comment.includes('3 шт.'))
  assert.ok(!result.comment.includes('30 см'), 'piece quantities must never be described as height')
  assert.equal(equipmentSelection([item.id], { [item.id]: 0 }).selected.length, 0)
}
assert.equal(optionQuantityLimit(option('ceiling-height')), 2)
assert.equal(equipmentSelection(['ceiling-height'], { 'ceiling-height': 999 }).knownTotal, 44000)
assert.equal(optionQuantityLabel({ id: 'ceiling-height', quantity: 1 }), ' (+10 см)')
assert.equal(equipmentSelection(['bench-light'], { 'bench-light': 2 }).knownTotal, 7000, 'two plafons are one fixed-price kit')
assert.equal(equipmentSelection(['guard', 'stove-fireproof-boards']).knownTotal, 36500, 'metal guard and protective boards are separate services')
assert.equal(equipmentSelection(['steam-floor-oil', 'steam-bench-oil', 'steam-lining-oil', 'lounge-floor-varnish']).knownTotal, 72000)
assert.equal(equipmentSelection(['steam-floor-oil', 'steam-bench-oil', 'steam-lining-oil', 'lounge-floor-varnish']).unpricedCount, 0)
for (const first of stoveOptionIds) for (const second of stoveOptionIds) {
  assert.deepEqual(plain(normalizeOptionIds([first, second])), [second], 'only the last explicitly chosen stove survives')
  assert.equal(equipmentSelection([first, second]).knownTotal, 0, 'the included base stove and full replacement retail must never increase the price')
}
assert.deepEqual(plain(toggleEquipmentOption(['ermak'], 'ermak-16-ps')), ['ermak-16-ps'])
assert.deepEqual(plain(toggleEquipmentOption(['ermak'], 'ermak')), [])
assert.deepEqual(plain(normalizeOptionIds(['external-light', 'hidden-wiring', 'outdoor-lighting'])), ['hidden-wiring', 'outdoor-lighting'])
assert.deepEqual(plain(normalizeOptionIds(['hidden-wiring', 'outdoor-lighting', 'external-light'])), ['external-light'])
assert.equal(equipmentSelection(['hidden-wiring', 'outdoor-lighting', 'external-light']).knownTotal, 29000, 'legacy composite wiring/light package must not be charged twice')
let modelCases = 0
for (const model of [...saunas, ...homes]) {
  const result = calculate(model, ['outdoor-lamp', 'roof-overhang-light', 'wall-point', 'panoramic-window-600-1800', 'ceiling-height'], { quantities: { 'outdoor-lamp': 3, 'roof-overhang-light': 4, 'wall-point': 2, 'panoramic-window-600-1800': 2, 'ceiling-height': 2 } })
  assert.equal(result.optionsSubtotal, 129000)
  assert.equal(result.total, model.priceFrom + 129000)
  assert.deepEqual(plain(result.options.map(item => item.quantity)), [2, 2, 3, 4, 2])
  const note = configurationManagerText(result)
  assert.ok(note.includes('3 шт.') && note.includes('4 шт.') && note.includes('+20 см'))
  assert.ok(!note.includes('+30 см'))
  const included = modelOptionAvailability(model).filter(row => row.status === 'included').map(row => row.option.id)
  assert.equal(calculate(model, included).optionsSubtotal, 0)
  const finalOptions = calculate(model, ['led', 'steam-bench-oil'])
  assert.equal(finalOptions.optionsSubtotal, included.includes('steam-bench-oil') ? 12000 : 27000, `${model.id}: final prices charge once, already included oil remains free`)
  assert.equal(finalOptions.unpricedCount, 0)
  assert.ok(configurationManagerText(finalOptions).includes('12\u00a0000 ₽'))
  if (!included.includes('steam-bench-oil')) assert.ok(configurationManagerText(finalOptions).includes('15\u00a0000 ₽'))
  for (const id of Object.keys(replacementRetail)) assert.equal(calculate(model, [id]).optionsSubtotal, 0, `${model.id}: ${id} retail must never be added to the base price`)
  modelCases++
}
const scandi = saunas.find(model => model.id === 'bg-09')
assert.equal(modelOptionAvailability(scandi).find(row => row.option.id === 'ermak-base').status, 'included')
assert.equal(modelOptionAvailability(scandi).find(row => row.option.id === 'ermak').status, 'unknown', 'base Ermak12 must not be mistaken for Ermak12PS')
const style = saunas.find(model => model.id === 'bg-24')
assert.equal(calculate(style, ['wash-tap']).optionsSubtotal, 0, 'catalogue-included tap must not be paid twice')
const barn = saunas.find(model => model.id === 'bg-28')
assert.equal(modelOptionAvailability(barn).find(row => row.option.id === 'ermak-base').status, 'unknown', 'the confirmed ETNA18 must not become Ermak12')
const maximalQuantities = Object.fromEntries(options.map(item => [item.id, optionQuantityLimit(item)]))
for (const model of [...saunas, ...homes]) {
  const maximal = calculate(model, options.map(item => item.id), { promotionalDiscount: true, quantities: maximalQuantities, deliveryDistrict: 'outside', deliveryAddress: 'А'.repeat(300) })
  assert.ok(configurationManagerText(maximal, true).length <= 1500, `${model.id}: every selected service and maximum quantity must fit the bounded manager note with the full address: ${configurationManagerText(maximal, true).length}`)
}
assert.ok(equipmentSelection(options.map(item => item.id), maximalQuantities, { deliveryDistrict: 'outside', deliveryAddress: 'А'.repeat(300) }).comment.length <= 1500)

// Exercise the real context state/persistence with React hook stubs, without browser or personal data.
let states = [], effects = [], dependencies = [], hook = 0
const storage = new Map()
const storageEvents = []
const react = {
  createContext: () => ({ Provider: 'provider' }), useContext: () => undefined,
  useState: initial => { const index = hook++; if (!(index in states)) states[index] = initial; return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next }] },
  useEffect: (callback, deps) => { const index = hook++; if (!dependencies[index] || deps.some((value, position) => value !== dependencies[index][position])) { effects.push(callback); dependencies[index] = deps } },
}
const context = load('src/components/catalog/ModelConfigurationContext.tsx', { react, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) } }, { window: { location: { search: '' }, localStorage: { getItem: key => { storageEvents.push('read'); return storage.get(key) || null }, setItem: (key, value) => { storageEvents.push('write'); storage.set(key, value) } } }, URLSearchParams })
function render(model = saunas[0], optionsEnabled = true) { hook = 0; effects = []; const view = context.ModelConfigurationProvider({ model, optionsEnabled, children: null }); for (const effect of effects) effect(); return view.props.value }
render(); let state = render()
state.toggleOption('outdoor-lamp'); state = render(); state.setOptionQuantity('outdoor-lamp', 3); state.setDeliveryDistrict('ramenskoe'); state.setDeliveryAddress('НЕ СОХРАНЯТЬ АДРЕС'); state = render()
assert.equal(state.configuration.optionsSubtotal, 21000)
assert.equal(state.configuration.deliveryAddress, 'НЕ СОХРАНЯТЬ АДРЕС')
const snapshot = JSON.parse(storage.get(`banger:model-configuration:v1:${saunas[0].id}`))
assert.deepEqual(snapshot, { ids: ['outdoor-lamp'], quantities: { 'outdoor-lamp': 3 }, district: 'ramenskoe' })
assert.ok(!JSON.stringify(snapshot).includes('АДРЕС') && !('address' in snapshot) && !('deliveryAddress' in snapshot), 'persist only option preferences, never the delivery address')
states = []; dependencies = []; render(); state = render()
assert.equal(state.configuration.optionsSubtotal, 21000)
assert.equal(state.configuration.options[0].quantity, 3)
assert.equal(state.configuration.deliveryDistrict, 'ramenskoe')
assert.equal(state.configuration.deliveryAddress, '')
state.setOptionQuantity('outdoor-lamp', 0); state = render(); assert.equal(state.configuration.options.length, 0)
state.resetSelection(); state = render(); assert.deepEqual(plain(state.selectedIds), [])
const storageKey = `banger:model-configuration:v1:${saunas[0].id}`
const preservedSelection = JSON.stringify({ ids: ['led', 'steam-bench-oil', 'outdoor-lamp'], quantities: { 'outdoor-lamp': 3 }, district: 'ramenskoe' })
storage.set(storageKey, preservedSelection)
storageEvents.length = 0
// Switching an already mounted provider off must preserve saved calculator choices.
state = render(saunas[0], false)
state.toggleOption('led'); state.setOptionQuantity('outdoor-lamp', 5); state.setDeliveryDistrict('outside'); state.setDeliveryAddress('НЕ СОХРАНЯТЬ АДРЕС')
state = render(saunas[0], false)
assert.deepEqual(plain(state.selectedIds), [])
assert.equal(state.configuration.optionsSubtotal, 0)
assert.equal(state.configuration.total, saunas[0].priceFrom)
assert.equal(state.configuration.deliveryDistrict, 'unknown')
assert.equal(state.configuration.deliveryAddress, '')
assert.equal(storage.get(storageKey), preservedSelection)
assert.deepEqual(storageEvents, [], 'disabled model sheets must neither restore nor write calculator preferences')
// A fresh standard sheet must likewise leave the existing saved configuration intact.
states = []; dependencies = []; render(saunas[0], false); state = render(saunas[0], false)
assert.equal(state.configuration.total, saunas[0].priceFrom)
assert.deepEqual(plain(state.configuration.options), [])
assert.deepEqual(storageEvents, [])
assert.equal(storage.get(storageKey), preservedSelection)
state = render(); state = render()
assert.equal(state.configuration.optionsSubtotal, 48000, 'reenabling the calculator must restore final-price options and quantity')
assert.deepEqual(plain(state.selectedIds), ['led', 'outdoor-lamp', 'steam-bench-oil'])
console.log(JSON.stringify({ status: 'PASS', options: options.length, modelQuantityCases: modelCases, finalPriceModelCases: modelCases, stovePairCases: stoveOptionIds.length ** 2, fullRetailAmountsExcluded: Object.keys(replacementRetail).length, storage: 'options/quantities/district restored; address never persisted; disabled sheets never read/write preferences', posts: 0 }, null, 2))
