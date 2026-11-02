import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const nextConfig = require(path.join(root, 'next.config.js'))
const dist = path.join(root, nextConfig.distDir || 'dist')

function compile(relative, mapped = {}) {
  const file = path.join(root, relative)
  const source = fs.readFileSync(file, 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  const exports = {}
  const module = { exports }
  vm.runInNewContext(code, { exports, module, require: id => {
    if (mapped[id]) return mapped[id]
    throw new Error(`Unexpected runtime import in ${relative}: ${id}`)
  }, Set, Map, Object, Array, JSON, Math, Number, String }, { filename: file })
  return module.exports
}

const data = compile('src/data/index.ts')
const optionsData = compile('src/data/options.ts')
const modelConfig = compile('src/data/model-configuration.ts')
const selection = compile('src/lib/equipment-selection.ts', { '@/data/options': optionsData })
const availability = compile('src/lib/model-option-availability.ts', {
  '@/data/model-configuration': modelConfig,
  '@/lib/equipment-selection': selection,
})
const calculation = compile('src/lib/model-configuration-selection.ts', { '@/lib/model-option-availability': availability })
const unitOnly = process.argv.includes('--unit')
const guidance = compile('src/data/option-guidance.ts')
const models = [...data.saunas, ...data.homes]
const enabled = optionsData.additionalOptions.filter(option => option.enabled)
assert.equal(models.length, 31, 'all 25 sauna and 6 home models must be checked')
assert.equal(enabled.length, 19, 'current global option list must not be silently changed')

const duplicateSelection = selection.equipmentSelection(['boiler', 'boiler', 'decor', 'unknown'])
assert.equal(duplicateSelection.selected.length, 2, 'duplicate ids must count once')
assert.equal(duplicateSelection.knownTotal, 50_300, 'published option prices must be summed once')
const unpricedSelection = selection.equipmentSelection(['tray', 'tray'])
assert.equal(unpricedSelection.selected.length, 1, 'unpriced option must not duplicate')
assert.equal(unpricedSelection.knownTotal, 0, 'unpriced option must not affect the numeric total')
assert.equal(unpricedSelection.unpricedCount, 1, 'unpriced option must remain disclosed')

let checkedPages = 0
const matrix = []
for (const model of models) {
  const isHome = data.homes.some(item => item.id === model.id)
  const relative = `${isHome ? 'dom' : 'banya'}/${model.slug}.html`
  const htmlPath = path.join(dist, relative)
  if (!unitOnly) assert.ok(fs.existsSync(htmlPath), `missing exported model page ${relative}`)
  const html = unitOnly ? '' : fs.readFileSync(htmlPath, 'utf8')
  if (!unitOnly) {
    assert.ok(html.includes(`data-model-option-calculator="${model.id}"`), `${model.id}: calculator is not rendered`)
    assert.ok(html.includes(`data-base-price="${model.priceFrom}"`), `${model.id}: base price differs from model data`)
  }
  const items = availability.modelOptionAvailability(model)
  assert.equal(items.length, enabled.length, `${model.id}: option list length mismatch`)
  const renderedIds = unitOnly ? [] : [...html.matchAll(/data-option-id="([^"]+)"/g)].map(match => match[1])
  if (!unitOnly) assert.equal(renderedIds.length, items.length, `${model.id}: not all option rows rendered (available + included + confirmation groups)`)
  assert.equal(new Set(renderedIds).size, renderedIds.length, `${model.id}: duplicate option row`)
  for (const item of items) {
    const image = guidance.optionGuidance[item.option.id]?.image
    assert.ok(image && fs.existsSync(path.join(root, 'public', image.replace(/^\//, ''))), `${model.id}/${item.option.id}: missing option photo or diagram`)
    if (!unitOnly && item.blockedReason) assert.ok(html.includes(item.blockedReason), `${model.id}/${item.option.id}: compatibility status text missing`)
  }
  const calculated = calculation.calculateModelConfiguration(model, [...enabled.map(option => option.id), 'unknown', 'boiler'])
  assert.equal(calculated.basePrice, model.priceFrom)
  assert.equal(calculated.total, model.priceFrom + calculated.optionsSubtotal - calculated.discount)
  assert.equal(calculated.discount, 0, `${model.id}: promotional discount must not be applied without the promo source`)
  assert.equal(calculated.selectedOptionIds.length, new Set(calculated.selectedOptionIds).size)
  assert.ok(calculated.selectedOptionIds.every(id => items.find(item => item.option.id === id)?.status === 'available'))
  assert.equal(calculation.calculateModelConfiguration(model, []).total, model.priceFrom)
  for (const item of items) {
    assert.ok(['available', 'included', 'unavailable', 'unknown'].includes(item.status))
    assert.ok(item.source && item.reason)
    if (item.status !== 'available') assert.ok(!calculated.selectedOptionIds.includes(item.option.id))
  }
  const promotional = calculation.calculateModelConfiguration(model, [], { promotionalDiscount: true })
  if (isHome) assert.equal(promotional.discount, 0, `${model.id}: homes are not part of the bath promotion`)
  else {
    assert.equal(promotional.discount, 15_000, `${model.id}: confirmed 15 000 RUB bath offer must apply only on request`)
    assert.equal(promotional.total, model.priceFrom - 15_000)
  }
  matrix.push({ id: model.id, name: model.name, type: isHome ? 'home' : 'sauna', slug: model.slug, route: `${isHome ? '/dom' : '/banya'}/${model.slug}`, priceFrom: model.priceFrom,
    counts: availability.modelOptionStatusCounts(model),
    rows: items.map(({ option, status, reason, source }) => ({ option: option.id, name: option.name, status, reason, source })) })
  checkedPages++
}

const totals = { available: 0, included: 0, unavailable: 0, unknown: 0 }
for (const model of matrix) for (const key of Object.keys(totals)) totals[key] += model.counts[key]
assert.equal(totals.available + totals.included + totals.unavailable + totals.unknown, 31 * 19, 'matrix must cover every model/option pair')
assert.ok(totals.included >= 40, 'confirmed base-overlap rows must be detected from catalogue features')
assert.equal(totals.unavailable, 0, 'current sources confirm no incompatible option; do not invent unavailable rows')
assert.ok(totals.available > 0 && totals.unknown > 0, 'matrix must distinguish confirmed availability from confirmation-needed positions')

const planless = matrix.filter(model => ['bg-25', 'bg-26', 'bg-27'].includes(model.id))
assert.equal(planless.length, 3)
for (const model of planless) {
  assert.equal(model.counts.available, 0, `${model.id}: model without confirmed planning must not offer guaranteed options`)
  assert.equal(model.counts.unknown, 19, `${model.id}: all options require confirmation`)
}
const availableCounts = new Set(matrix.map(model => model.counts.available))
assert.ok(availableCounts.size >= 4, 'compatibility matrix must differ between models, not show one identical option list')
const evidence = id => matrix.find(model => model.id === id).rows
assert.equal(evidence('bg-01').find(row => row.option === 'furniture').status, 'included')
assert.equal(evidence('bg-04').find(row => row.option === 'ermak').status, 'unknown')
assert.equal(evidence('bg-09').find(row => row.option === 'ermak').status, 'included')
assert.equal(evidence('bg-18').find(row => row.option === 'external-light').status, 'included')
assert.equal(evidence('bg-18').find(row => row.option === 'shade').status, 'included')
assert.equal(evidence('bg-19').find(row => row.option === 'boiler').status, 'included')
assert.equal(evidence('bg-19').find(row => row.option === 'shower').status, 'included')
assert.equal(evidence('bg-20').find(row => row.option === 'wc').status, 'included')
assert.equal(evidence('bg-21').find(row => row.option === 'floor').status, 'included')
assert.equal(evidence('bg-23').find(row => row.option === 'floor').status, 'included')
assert.equal(evidence('bg-24').find(row => row.option === 'ermak').status, 'included')
assert.equal(evidence('bg-28').find(row => row.option === 'boiler').status, 'included')
assert.equal(evidence('bg-04').find(row => row.option === 'boiler').status, 'available')
assert.equal(evidence('bg-09').find(row => row.option === 'shower').status, 'unknown')
assert.equal(evidence('bg-19').find(row => row.option === 'ermak').status, 'unknown')
assert.equal(evidence('bg-04').find(row => row.option === 'tray').status, 'unknown')

const managerText = calculation.configurationManagerText(calculation.calculateModelConfiguration(models.find(model => model.id === 'bg-01'), ['boiler', 'decor'])).replace(/[\u00a0\u202f]/g, ' ')
for (const expected of ['Комплектация: Исток 4', 'Базовая стоимость: 397 500 ₽', 'Бойлер 50 л', 'Декоративные решётки', 'Итого:'])
  assert.ok(managerText.includes(expected), `manager configuration text is missing ${expected}`)
assert.ok(calculation.configurationManagerText(calculation.calculateModelConfiguration(models.find(model => model.id === 'bg-01'), [])).includes('не выбраны'))
const managerConfiguration = calculation.configurationManagerText(calculation.calculateModelConfiguration(models.find(model => model.id === 'bg-01'), ['boiler', 'decor', 'led']))
const merged = calculation.mergeManagerComment('Перезвоните после 18:00', managerConfiguration)
assert.ok(merged.length <= 1500, 'manager comment must fit the server limit')
assert.ok(merged.includes('Перезвоните после 18:00') && merged.includes('Комплектация: Исток 4') && merged.includes('Бойлер 50 л') && merged.includes('Итого:'), 'manager comment must keep both the client text and the configuration')
const longMerged = calculation.mergeManagerComment('Я'.repeat(2000), managerConfiguration)
assert.ok(longMerged.length <= 1500 && longMerged.includes('Комплектация: Исток 4') && longMerged.includes('Итого:'), 'long client text must not push the configuration out of the manager message')
assert.equal(calculation.mergeManagerComment('', managerConfiguration), managerConfiguration)

if (process.argv.includes('--write-matrix')) {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true })
  fs.writeFileSync(path.join(root, 'docs', 'model-option-compatibility.json'), JSON.stringify({
    generatedFrom: ['src/data/options.ts', 'src/data/index.ts', 'src/data/model-configuration.ts', 'src/lib/model-option-availability.ts'],
    catalogueSource: 'Бани Герасимов — Каталог(1).pptx (model slides + slide «Дополнительные возможности»)',
    rules: {
      included: 'Оплачиваемая позиция уже указана в опубликованных особенностях модели — повторно не оплачивается.',
      available: 'Опция устанавливается, потому что требующаяся для неё зона/оборудование подтверждены базовой комплектацией модели; конкретное исполнение согласуется при заказе.',
      unknown: 'Нет подтверждённой планировки/совместимости либо позиция является заменой или неподтверждённым инженерным решением — клиенту не предлагается как гарантированно доступная.',
      unavailable: 'Подтверждённая несовместимость. В текущих источниках таких позиций нет.',
    },
    totals,
    models: matrix,
  }, null, 1) + '\n')
  console.log('WROTE docs/model-option-compatibility.json')
}

console.log(JSON.stringify({
  status: 'PASS',
  models: checkedPages,
  optionsPerModel: enabled.length,
  modelPages: unitOnly ? 'not checked (--unit)' : checkedPages,
  compatibilityStates: totals,
  perModelAvailable: Object.fromEntries(matrix.map(model => [model.id, model.counts.available])),
  basePriceSource: 'model.priceFrom, unchanged',
  duplicateSelection: 'counted once',
  unpricedOption: 'excluded from total and disclosed',
  promotionalDiscount: '15 000 RUB only with exit-intent source, baths only',
  baseOverlapEvidence: { furniture: 'bg-01', ermak: 'bg-09', externalLight: 'bg-18', boiler: 'bg-19', wc: 'bg-20', floor: 'bg-21', stoveReplacement: 'bg-04', planless: planless.map(model => model.id) },
}, null, 2))
