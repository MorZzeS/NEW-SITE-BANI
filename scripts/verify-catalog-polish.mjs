import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'

const jsx = (type, props) => ({ type, props })
const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)]
const content = node => typeof node === 'string' || typeof node === 'number' ? String(node) : !node || typeof node !== 'object' ? '' : [node.props?.children].flat(Infinity).map(content).join(' ')
function load(file, requireModule = id => { throw new Error(`Unexpected dependency: ${id}`) }, scope = {}, sourceText) {
  const exports = {}
  const result = ts.transpileModule(sourceText ?? fs.readFileSync(file, 'utf8'), { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } })
  assert.equal(result.diagnostics?.length, 0, `Syntax diagnostics: ${file}`)
  vm.runInNewContext(result.outputText, { exports, require: requireModule, ...scope })
  return exports
}
const options = load('src/data/options.ts')
const guidance = load('src/data/option-guidance.ts')
const catalog = load('src/data/index.ts')
const configuration = load('src/data/model-configuration.ts')
const selection = load('src/lib/equipment-selection.ts', id => { assert.equal(id, '@/data/options'); return options })
const allOptions = options.additionalOptions.filter(option => option.enabled)
const baseRevision = process.env.CATALOG_BASE_REVISION ?? 'edfd22c'
const baseCatalog = load('src/data/index.ts', undefined, {}, execFileSync('git', ['show', `${baseRevision}:src/data/index.ts`], { encoding: 'utf8' }))
const baseOptions = load('src/data/options.ts', undefined, {}, execFileSync('git', ['show', `${baseRevision}:src/data/options.ts`], { encoding: 'utf8' }))
const prices = source => JSON.stringify([...source.saunas, ...source.homes].map(product => ({ id: product.id, priceFrom: product.priceFrom, priceVariants: product.priceVariants })))
assert.equal(prices(catalog), prices(baseCatalog), 'All model and alternative execution prices must match published baseline')
assert.equal(JSON.stringify(options.additionalOptions), JSON.stringify(baseOptions.additionalOptions), 'Option source data and all prices must remain unchanged')
assert.equal(catalog.saunas.length + catalog.homes.length, 31)
assert.equal(allOptions.length, 19)
assert.equal(allOptions.filter(option => option.salePrice !== null).length, 18)
for (const option of allOptions) {
  const help = guidance.optionGuidance[option.id]
  assert(help?.explanation && help.notes && help.caption, `Missing help: ${option.id}`)
  assert(fs.existsSync(`public${help.image}`), `Missing guidance image: ${option.id}`)
  if (option.id !== 'boiler') assert(fs.readFileSync(`public${help.image}`, 'utf8').includes('<title'), `Unlabelled schematic: ${option.id}`)
}
assert.equal(guidance.optionGuidance.floor.caption, 'Схема принципа работы; исполнение согласуется')
assert.equal(selection.equipmentSelection(allOptions.map(option => option.id)).knownTotal, 312400)
assert.equal(selection.equipmentSelection(['floor', 'decor', 'ermak']).knownTotal, 57900)
assert.equal(selection.equipmentSelection(['boiler', 'tray', 'boiler']).knownTotal, 37500)
assert.equal(selection.equipmentSelection(['boiler', 'tray']).unpricedCount, 1)

let state = [], hook = 0
const react = {
  useState: initial => { const index = hook++; return [state[index] ?? initial, next => { state[index] = typeof next === 'function' ? next(state[index] ?? initial) : next }] },
  useRef: value => ({ current: value }), useMemo: fn => fn(), useEffect: () => {},
}
const styles = { default: new Proxy({}, { get: (_, key) => String(key) }) }
const imageHelper = load('src/lib/catalog-image.ts')
function shared(id) {
  if (id === 'react') return react
  if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx }
  if (id === 'react-dom') return { createPortal: node => node }
  if (id === 'next/image') return { default: 'image' }
  if (id === 'next/link') return { default: 'link' }
  if (id === 'lucide-react') return new Proxy({}, { get: (_, key) => key })
  if (id === 'clsx') return { default: (...items) => items.filter(Boolean).join(' ') }
  if (id === '@/data') return catalog
  if (id === '@/data/options') return options
  if (id === '@/data/option-guidance') return guidance
  if (id === '@/data/equipment') return { baseEquipmentRows: [] }
  if (id === '@/data/model-configuration') return configuration
  if (id === '@/lib/equipment-selection') return selection
  if (id === '@/lib/analytics') return { trackGoal: () => {} }
  if (id === '@/lib/catalog-image') return imageHelper
  if (id === '@/lib/catalog-labels') return { modelCountWord: () => 'моделей' }
  if (id === '@/components/forms/CTAFormInline') return { CTAFormInline: 'contact-form' }
  if (id === './InteriorExecutionGallery') return { InteriorExecutionGallery: 'interior-gallery' }
  if (id.endsWith('.module.css')) return styles
  if (id === '@/components/catalog/SaunaCard') return { SaunaCard: 'sauna-card' }
  if (id === '@/components/catalog/HomeCard') return { HomeCard: 'home-card' }
  if (id === '@/components/catalog/ProductDecisionTools') return { ProductDecisionTools: 'decision-tools' }
  throw new Error(`Unexpected UI dependency: ${id}`)
}
const equipment = load('src/components/catalog/EquipmentConfigurator.tsx', shared)
const renderEquipment = () => { hook = 0; return nodes(equipment.EquipmentConfigurator()) }
const summary = () => renderEquipment().find(node => node.props?.['data-selected-count'] !== undefined)
assert.equal(renderEquipment().filter(node => node.type === 'summary').length, 24, '19 options plus five popular disclosures')
for (const label of renderEquipment().filter(node => node.type === 'label')) assert(!nodes(label).some(node => node.type === 'summary'), 'Help must be outside checkbox labels')
for (const id of ['floor', 'decor', 'ermak']) {
  const option = allOptions.find(option => option.id === id)
  renderEquipment().find(node => node.type === 'input' && node.props['aria-label'] === `Добавить: ${option.name}`).props.onChange()
}
assert.equal(summary().props['data-selected-count'], 3)
assert.equal(summary().props['data-additional-total'], 57900)
assert(renderEquipment().find(node => node.type === 'contact-form').props.configurationNote.includes('Проливной пол'))
renderEquipment().find(node => node.type === 'button' && node.props['aria-label'] === 'Убрать: Печь Ермак 12 ПС').props.onClick()
assert.equal(summary().props['data-additional-total'], 33400)
renderEquipment().find(node => node.type === 'button' && node.props.className === 'clear').props.onClick()
assert.equal(summary().props['data-selected-count'], 0)

for (const [kind, source, cardType] of [['bani', catalog.saunas, 'sauna-card'], ['doma', catalog.homes, 'home-card']]) {
  state = []; hook = 0
  const page = load(`src/app/katalog/${kind}/page.tsx`, shared).default
  const renderPage = () => { hook = 0; return nodes(page()) }
  for (const product of source.slice(0, 5)) renderPage().find(node => node.type === 'decision-tools').props.onToggleCompare(product.id)
  assert.equal(renderPage().find(node => node.type === 'decision-tools').props.selectedIds.length, 4, `${kind}: fifth model blocked`)
  assert(renderPage().filter(node => node.type === cardType).every(node => node.props.compareDisabled), `${kind}: unselected controls disabled at limit`)
  renderPage().find(node => node.type === 'decision-tools').props.onToggleCompare(source[1].id)
  assert.equal(renderPage().find(node => node.type === 'decision-tools').props.selectedIds.length, 3)
}

state = [true]; hook = 0
const removed = []
const compare = load('src/components/catalog/ProductDecisionTools.tsx', shared, { document: { body: {} }, requestAnimationFrame: callback => callback() })
const compared = [catalog.saunas[0], catalog.saunas[9], catalog.saunas[18], catalog.saunas.find(product => product.id === 'bg-28')]
const dialog = nodes(compare.ProductDecisionTools({ kind: 'bani', products: catalog.saunas, selectedIds: compared.map(product => product.id), onToggleCompare: id => removed.push(id) }))
assert.equal(dialog.filter(node => node.type === 'table').length, 1)
assert.equal(dialog.find(node => node.type === 'thead').props.children.props.children.length, 2)
assert.equal(nodes(dialog.find(node => node.type === 'thead')).filter(node => node.type === 'th').length, 5, 'One parameter column + four actual selected models')
assert.equal(dialog.filter(node => node.type === 'image').length, 4)
assert.deepEqual(dialog.filter(node => node.type === 'image').map(node => node.props.src), compared.map(product => imageHelper.catalogCardImage(product.image)))
assert(content(dialog.find(node => node.type === 'tbody')).includes('Утепление 100 мм'))
for (const product of compared) {
  assert(content(dialog.find(node => node.type === 'thead')).includes(product.name))
  dialog.find(node => node.type === 'button' && node.props['aria-label'] === `Убрать из сравнения: ${product.name}`).props.onClick()
}
assert.deepEqual(removed, compared.map(product => product.id))
assert(dialog.some(node => node.type === 'td' && node.props.className === 'different'), 'Differing rows highlighted')
for (const [component, key, product] of [['SaunaCard', 'sauna', catalog.saunas[0]], ['HomeCard', 'home', catalog.homes[0]]]) {
  const card = load(`src/components/catalog/${component}.tsx`, shared)[component]
  const rendered = nodes(card({ [key]: product, bestSeller: true }))
  assert.equal(rendered[0].props.className, 'wrapper')
  assert(rendered.find(node => node.type === 'link').props.className.includes('link'))
  assert.equal(rendered.find(node => node.type === 'image').props.src, imageHelper.catalogCardImage(product.image))
}
console.log('PASS: 19 option explainers/assets; 18 unchanged priced options; canonical totals; checkbox-label separation; selection/reset/transfer; both catalog four-model limit and removal; semantic comparison, image mapping, current 100-mm base rows, differences and dialog removal; card stretch chain. Browser layout, focus trap and themes require live QA.')
