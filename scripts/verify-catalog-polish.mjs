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
const allOptions = options.additionalOptions.filter(option => option.enabled)
// Compose the fixed historical baseline and exact approved option fixture audit.
// Never reset the baseline to HEAD or silently accept current source prices.
const runGuard = script => execFileSync(process.execPath, [script], { encoding: 'utf8' }).trim()
const priceAudit = JSON.parse(runGuard('scripts/verify-price-update.mjs'))
assert.equal(priceAudit.status, 'PASS')
assert.deepEqual(priceAudit.errors, [])
assert.equal(priceAudit.counts.models, 31)
assert.equal(priceAudit.counts.alternativePrices, 21)
assert.equal(priceAudit.counts.paidOptions, 39)
assert.equal(priceAudit.counts.unpricedOptions, 5)
console.log('PASS: fixed-baseline prices for 31 models / 21 variants and exact owner-approved option definitions')
console.log(runGuard('scripts/verify-equipment-configurator.mjs'))
console.log(runGuard('scripts/check-approved-option-calculations.mjs'))
assert.equal(catalog.saunas.length + catalog.homes.length, 31)
assert.equal(allOptions.length, 45)
assert.equal(new Set(allOptions.map(option => option.id)).size, 45)
assert.equal(allOptions.filter(option => option.salePrice > 0).length, 39)
assert.equal(allOptions.filter(option => option.salePrice === null).length, 5)
assert.deepEqual(Array.from(allOptions.filter(option => option.salePrice === 0), option => option.id), ['ermak-base'])
// New standalone pictograms receive their accessible names from the real Image
// alt checked below. All existing internally labelled schematics stay labelled.
const externallyLabelledSchematics = new Set(['delivery', 'crane-unload', 'onsite-assembly', 'replanning'])
for (const option of allOptions) {
  const help = guidance.optionGuidance[option.id]
  assert(help?.explanation && help.notes && help.caption, `Missing help: ${option.id}`)
  assert(fs.existsSync(`public${help.image}`), `Missing guidance image: ${option.id}`)
  if (option.id !== 'boiler') {
    const schematic = fs.readFileSync(`public${help.image}`, 'utf8')
    assert(schematic.includes('<svg') && schematic.includes('viewBox='), `Invalid schematic: ${option.id}`)
    if (!externallyLabelledSchematics.has(option.id)) assert(/<title(?:\s[^>]*)?>[^<]+<\/title>/.test(schematic), `Unlabelled schematic: ${option.id}`)
  }
}
assert.equal(guidance.optionGuidance.floor.caption, 'Схема принципа работы; исполнение согласуется')

let state = [], hook = 0
const react = {
  useState: initial => { const index = hook++; return [state[index] ?? initial, next => { state[index] = typeof next === 'function' ? next(state[index] ?? initial) : next }] },
  useRef: value => ({ current: value }), useMemo: fn => fn(), useEffect: () => {},
}
const styles = { default: new Proxy({}, { get: (_, key) => String(key) }) }
const sitePath = load('src/lib/site-path.ts', undefined, { process: { env: {} } })
const imageHelper = load('src/lib/catalog-image.ts', id => { assert.equal(id, '@/lib/site-path'); return sitePath })
const catalogFilters = load('src/lib/catalog-filters.ts')
function shared(id) {
  if (id === 'react') return react
  if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx }
  if (id === 'react-dom') return { createPortal: node => node }
  if (id === 'next/image') return { default: 'image' }
  if (id === 'next/link') return { default: 'link' }
  if (id === 'next/navigation') return { useSearchParams: () => new URLSearchParams() }
  if (id === 'lucide-react') return new Proxy({}, { get: (_, key) => key })
  if (id === 'clsx') return { default: (...items) => items.filter(Boolean).join(' ') }
  if (id === '@/data') return catalog
  if (id === '@/data/options') return options
  if (id === '@/data/option-guidance') return guidance
  if (id === '@/data/model-configuration') return configuration
  if (id === '@/lib/site-path') return sitePath
  if (id === '@/lib/catalog-filters') return catalogFilters
  if (id === '@/lib/catalog-image') return imageHelper
  if (id === '@/lib/catalog-labels') return { modelCountWord: () => 'моделей' }
  if (id.endsWith('.module.css')) return styles
  if (id === '@/components/catalog/SaunaCard') return { SaunaCard: 'sauna-card' }
  if (id === '@/components/catalog/HomeCard') return { HomeCard: 'home-card' }
  if (id === '@/components/catalog/ProductDecisionTools') return { ProductDecisionTools: 'decision-tools' }
  throw new Error(`Unexpected UI dependency: ${id}`)
}
// The configurator guard above drives the current parent component. Also render
// its real option child independently to preserve help/label/image coverage.
const { ConfigurationOption } = load('src/components/catalog/ConfigurationOption.tsx', shared)
for (const option of allOptions) {
  let toggles = 0
  const inputId = `audit-${option.id}`
  const rendered = nodes(ConfigurationOption({ option, checked: false, inputId, price: 'audit', onToggle: () => toggles++ }))
  const label = rendered.find(node => node.type === 'label')
  const input = rendered.find(node => node.type === 'input')
  assert.equal(label.props.htmlFor, inputId)
  assert.equal(input.props.id, inputId)
  assert.equal(input.props['aria-labelledby'], `${inputId}-name`)
  assert(content(rendered.find(node => node.props?.id === `${inputId}-name`)).includes(option.name))
  assert(!nodes(label).some(node => node.type === 'summary' || node.props?.className === 'note'), `${option.id}: help must remain outside selection labels`)
  assert(content(rendered.find(node => node.props?.className === 'note')).includes(guidance.optionGuidance[option.id].notes), `${option.id}: help notes rendered`)
  assert.equal(rendered.find(node => node.type === 'image').props.src, guidance.optionGuidance[option.id].image)
  assert.equal(rendered.find(node => node.type === 'image').props.alt, option.id === 'boiler' ? 'Бойлер 50 л — фото из каталога' : `Иллюстративная схема: ${option.name}`)
  input.props.onChange()
  assert.equal(toggles, 1, `${option.id}: real option control forwards selection`)
}

for (const [kind, source, cardType] of [['bani', catalog.saunas, 'sauna-card'], ['doma', catalog.homes, 'home-card']]) {
  state = []; hook = 0
  const page = load(`src/app/katalog/${kind}/page.tsx`, shared).default
  const renderPage = () => { hook = 0; return nodes(page()) }
  for (const product of source.slice(0, 5)) renderPage().find(node => node.type === 'decision-tools').props.onToggleCompare(product.id)
  assert.equal(renderPage().find(node => node.type === 'decision-tools').props.selectedIds.length, 4, `${kind}: fifth model blocked`)
  assert(renderPage().filter(node => node.type === cardType).every(node => node.props.compareDisabled), `${kind}: unselected controls disabled at limit`)
  renderPage().find(node => node.type === 'decision-tools').props.onToggleCompare(source[1].id)
  assert.equal(renderPage().find(node => node.type === 'decision-tools').props.selectedIds.length, 3)
  assert(renderPage().filter(node => node.type === cardType).every(node => !node.props.compareDisabled), `${kind}: controls enabled after removal`)
  assert(renderPage().some(node => node.props?.className?.includes('auto-rows-fr')), `${kind}: equal-height catalog rows`)
}

state = [true]; hook = 0
const removed = []
const compare = load('src/components/catalog/ProductDecisionTools.tsx', shared, { document: { body: {} }, requestAnimationFrame: callback => callback() })
const compared = [catalog.saunas[0], catalog.saunas[9], catalog.saunas[18], catalog.saunas.find(product => product.id === 'bg-28')]
const dialog = nodes(compare.ProductDecisionTools({ kind: 'bani', products: catalog.saunas, selectedIds: compared.map(product => product.id), onToggleCompare: id => removed.push(id) }))
assert.equal(dialog.filter(node => node.type === 'table').length, 1)
assert.equal(nodes(dialog.find(node => node.type === 'thead')).filter(node => node.type === 'tr').length, 1)
const columnHeaders = nodes(dialog.find(node => node.type === 'thead')).filter(node => node.type === 'th')
assert.equal(columnHeaders.length, 5, 'One parameter column + four actual selected models')
assert(columnHeaders.every(node => node.props.scope === 'col'), 'Column headers have column scope')
assert(dialog.some(node => node.type === 'caption'), 'Comparison table has an accessible caption')
assert(dialog.some(node => node.props?.role === 'dialog' && node.props['aria-modal'] === 'true'))
for (const row of nodes(dialog.find(node => node.type === 'tbody')).filter(node => node.type === 'tr')) {
  const cells = nodes(row).filter(node => node.type === 'td')
  const header = nodes(row).find(node => node.type === 'th')
  assert.equal(header?.props.scope, 'row')
  assert.equal(cells.length, compared.length, `${content(header)}: one cell per selected model`)
  if (content(header) === 'Подробнее') continue
  const different = new Set(cells.map(content)).size > 1
  assert(cells.every(node => (node.props.className === 'different') === different), `${content(header)}: only differing values highlighted`)
}
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
  for (const className of ['card', 'content', 'footer']) assert(rendered.some(node => node.props?.className?.split(' ').includes(className)), `${component}: ${className} stretch chain`)
  assert.equal(rendered.find(node => node.type === 'image').props.src, imageHelper.catalogCardImage(product.image))
  assert(rendered.find(node => node.type === 'image').props.className.includes('object-contain'))
  assert.equal(rendered.find(node => node.type === 'source').props.srcSet, imageHelper.catalogCardImage(product.image, 'avif'))
  const compareCard = selected => nodes(card({ [key]: product, compareSelected: selected, compareDisabled: true, onCompare: () => {} })).find(node => node.type === 'button')
  assert.equal(compareCard(false).props.disabled, true, `${component}: unselected model disabled at limit`)
  assert.equal(compareCard(true).props.disabled, false, `${component}: selected model remains removable at limit`)
}
const cardCss = fs.readFileSync('src/components/catalog/CatalogCard.module.css', 'utf8')
for (const [selector, declarations] of [['wrapper', ['height:100%', 'display:flex']], ['link', ['height:100%', 'display:flex']], ['card', ['height:100%', 'display:flex', 'flex-direction:column']], ['content', ['flex:1', 'display:flex', 'flex-direction:column']], ['footer', ['margin-top:auto']]]) {
  const rule = cardCss.match(new RegExp(`\\.${selector}\\{([^}]+)\\}`))?.[1]
  assert(rule, `Missing card CSS rule: ${selector}`)
  for (const declaration of declarations) assert(rule.split(';').includes(declaration), `${selector}: ${declaration}`)
}
console.log('PASS: 44 option explainers/assets and real option controls; 38 priced / 5 pending / 1 included base option; fixed-baseline prices, canonical calculations, selection/reset/contact/clipboard/storage guards; both catalog four-model limit and removal; semantic comparison, image mapping, current 100-mm base rows, exact difference highlighting and dialog removal; card image/stretch chain. Browser layout, focus trap and themes require live QA.')
