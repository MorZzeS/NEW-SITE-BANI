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
const logistics = compile('src/lib/logistics.ts')
const selection = compile('src/lib/equipment-selection.ts', { '@/data/options': optionsData, '@/lib/logistics': logistics })
const availability = compile('src/lib/model-option-availability.ts', {
  '@/data/model-configuration': modelConfig,
  '@/lib/equipment-selection': selection,
})
const calculation = compile('src/lib/model-configuration-selection.ts', { '@/lib/model-option-availability': availability, '@/lib/logistics': logistics, '@/lib/equipment-selection': selection })
const unitOnly = process.argv.includes('--unit')
const guidance = compile('src/data/option-guidance.ts')
const models = [...data.saunas, ...data.homes]
const enabled = optionsData.additionalOptions.filter(option => option.enabled)
assert.equal(models.length, 31, 'all 25 sauna and 6 home models must be checked')
assert.equal(enabled.length, 45, 'global option list must contain the historical entries and approved additions/updates')
assert.equal(enabled.find(option => option.id === 'replanning')?.salePrice, 10000, 'standard plan change must use the owner-approved 10 000 RUB price')
assert.equal(enabled.find(option => option.id === 'replanning')?.name, 'Изменение стандартной планировки')
assert.equal(enabled.find(option => option.id === 'replanning')?.description, 'Изменение стандартной планировки бани по пожеланиям заказчика. Возможность перепланировки согласовывается индивидуально. Дополнительные материалы и сложные конструктивные изменения рассчитываются отдельно.')
assert.equal(enabled.find(option => option.id === 'onsite-assembly')?.salePrice, 300000, 'on-site assembly service must use the owner-approved 300 000 RUB amount')
assert.deepEqual(JSON.parse(JSON.stringify(enabled.slice(19, 29).map(option => [option.id, option.salePrice, option.priceUnit]))), [
  ['facade-ral', 25_000, 'опция'],
  ['ceiling-height', 22_000, '10 см'],
  ['outdoor-lighting', 15_000, 'опция'],
  ['larch-wash', null, 'опция'],
  ['delivery', 20_000, 'услуга'],
  ['crane-unload', 25_000, 'услуга'],
  ['onsite-assembly', 300_000, 'услуга'],
  ['wooden-window-600', 7_000, 'шт.'],
  ['wooden-window-400', 5_500, 'шт.'],
  ['replanning', 10_000, 'услуга'],
], 'new options and approved prices/units must be exact')
assert.equal(optionsData.additionalOptions.find(option => option.id === 'tray')?.salePrice, 18_000, 'curtained tray includes drain for the approved 18 000 RUB')
assert.equal(optionsData.additionalOptions.filter(option => /санузел/i.test(option.name)).length, 1, 'do not duplicate the already priced sanitary option')

const duplicateSelection = selection.equipmentSelection(['boiler', 'boiler', 'decor', 'unknown'])
assert.equal(duplicateSelection.selected.length, 2, 'duplicate ids must count once')
assert.equal(duplicateSelection.knownTotal, 50_300, 'historically approved prices must be summed once')
const unpricedSelection = selection.equipmentSelection(['larch-wash', 'larch-wash'])
assert.equal(unpricedSelection.selected.length, 1, 'unpriced option must not duplicate')
assert.equal(unpricedSelection.knownTotal, 0, 'unpriced option must not affect the numeric total')
assert.equal(unpricedSelection.unpricedCount, 1, 'unpriced option must remain disclosed')
assert.equal(optionsData.additionalOptions.find(option => option.id === 'tray')?.salePrice, 18_000, 'curtained shower tray includes its water outlet for 18 000 RUB')

const districtPrices = district => {
  const services = selection.equipmentSelection(['delivery', 'crane-unload'], {}, { deliveryDistrict: district })
  return services
}
assert.equal(districtPrices('ramenskoe').knownTotal, 45_000, 'district services add independently: 20 000 + 25 000 ₽')
assert.equal(districtPrices('ramenskoe').equipmentSubtotal, 0)
assert.equal(districtPrices('ramenskoe').logisticsSubtotal, 45_000)
assert.equal(districtPrices('outside').knownTotal, 0, 'outside-district logistics must never use the Ramensky tariffs')
assert.equal(districtPrices('outside').unpricedCount, 2)
assert.equal(districtPrices('unknown').knownTotal, 0, 'an unspecified district must not inherit a tariff')
assert.equal(districtPrices('unknown').unpricedCount, 2)
assert.ok(districtPrices('outside').comment.includes('Стоимость по согласованию'))
assert.ok(districtPrices('ramenskoe').comment.replace(/[\u00a0\u202f]/g, ' ').includes('Логистика, предварительно: от 45 000 ₽'))

let checkedPages = 0
const matrix = []
for (const model of models) {
  const isHome = data.homes.some(item => item.id === model.id)
  const premium = model.id === 'bg-28'
  const relative = `${isHome ? 'dom' : 'banya'}/${model.slug}.html`
  const htmlPath = path.join(dist, relative)
  if (!unitOnly) assert.ok(fs.existsSync(htmlPath), `missing exported model page ${relative}`)
  const html = unitOnly ? '' : fs.readFileSync(htmlPath, 'utf8')
  if (!unitOnly && premium) {
    assert.ok(html.includes('data-premium-configuration'), 'Barn Premium must show bespoke information')
    assert.ok(!html.includes('data-model-option-calculator'), 'Barn Premium must not show the standard calculator')
  }
  if (!unitOnly && !premium) {
    assert.ok(html.includes(`data-model-option-calculator="${model.id}"`), `${model.id}: calculator is not rendered`)
    assert.ok(html.includes(`data-base-price="${model.priceFrom}"`), `${model.id}: base price differs from model data`)
    assert.ok(html.includes('Расчёт предварительный. Применимость дополнений, размеры проёмов и состав работ подтверждает менеджер для выбранной модели. Уже включённые позиции повторно не оплачиваются.'), `${model.id}: estimate must disclose manager confirmation without claiming fit`)
    assert.ok(!html.includes('Совместимость требует подтверждения'), `${model.id}: separate blocked unknown-options heading must not return`)
    assert.ok(html.includes('Расчёт предварительный. Применимость дополнений, размеры проёмов и состав работ подтверждает менеджер для выбранной модели. Уже включённые позиции повторно не оплачиваются.'), `${model.id}: estimate must disclose manager confirmation without claiming fit`)
    assert.ok(!html.includes('Совместимость требует подтверждения'), `${model.id}: separate blocked unknown-options heading must not return`)
  }
  const items = availability.modelOptionAvailability(model)
  const replanningEligible = !isHome && !premium
assert.equal(items.length, enabled.length - (replanningEligible ? 0 : 1), `${model.id}: only eligible mobile sauna models may offer standard plan changes`)
  const replanningRow = items.find(item => item.option.id === 'replanning')
  if (replanningEligible) {
    assert.equal(replanningRow?.status, 'available', `${model.id}: plan-change service must be offered`)
    assert.equal(replanningRow?.option.salePrice, 10000)
    assert.equal(replanningRow?.option.category, 'Общее по бане')
    assert.equal(replanningRow?.reason, enabled.find(option => option.id === 'replanning').description)
  } else assert.equal(replanningRow, undefined, `${model.id}: plan-change service must not be offered`)
  const renderedIds = unitOnly ? [] : [...html.matchAll(/data-option-id="([^"]+)"/g)].map(match => match[1])
  if (!unitOnly && !premium) assert.equal(renderedIds.length, items.length, `${model.id}: not all option rows rendered (available + included + confirmation groups)`)
  assert.equal(new Set(renderedIds).size, renderedIds.length, `${model.id}: duplicate option row`)
  for (const item of items) {
    const image = guidance.optionGuidance[item.option.id]?.image
    assert.ok(image && fs.existsSync(path.join(root, 'public', image.replace(/^\//, ''))), `${model.id}/${item.option.id}: missing option photo or diagram`)
    if (!unitOnly && !premium && item.status === 'unknown' && item.blockedReason) {
      assert.ok(!html.includes(item.blockedReason), `${model.id}/${item.option.id}: internal compatibility rationale must not leak into the public card`)
      const publicRow = html.match(new RegExp(`<article\\b[^>]*data-option-id="${item.option.id}"[^>]*>`))?.[0]
      assert.ok(publicRow?.includes('data-option-selectable="true"'), `${model.id}/${item.option.id}: estimate-only item stays selectable for manager confirmation`)
    }
  }
  const calculated = calculation.calculateModelConfiguration(model, [...enabled.map(option => option.id), 'unknown', 'boiler'])
  assert.equal(calculated.basePrice, model.priceFrom)
  assert.equal(calculated.total, model.priceFrom + calculated.optionsSubtotal - calculated.discount)
  assert.equal(calculated.discount, 0, `${model.id}: promotional discount must not be applied without the promo source`)
  assert.equal(calculated.selectedOptionIds.length, new Set(calculated.selectedOptionIds).size)
  assert.equal(calculated.selectedOptionIds.includes('replanning'), replanningEligible, `${model.id}: standard plan change must be included exactly for eligible saunas`)
  assert.ok(calculated.selectedOptionIds.every(id => ['available', 'unknown'].includes(items.find(item => item.option.id === id)?.status)), `${model.id}: confirmed and estimate-only options can be selected`)
  assert.equal(calculated.unpricedCount, 3, `${model.id}: all pending prices and unpriced district logistics must be disclosed, while assembly replaces crane unloading`)
  assert.deepEqual(JSON.parse(JSON.stringify(calculated.individualItems)), ['larch-wash', 'delivery', 'ermak-16-premium-cast-iron'])
  assert.ok(calculated.selectedOptionIds.includes('onsite-assembly') && !calculated.selectedOptionIds.includes('crane-unload'), `${model.id}: assembly selection must not charge separate crane unloading`)
  assert.ok(calculation.configurationManagerText(calculated).includes('Предварительная сумма без позиций индивидуального расчёта, включая неподтверждённую логистику.'), `${model.id}: manager summary must carry the preliminary-total caveat`)
  assert.equal(calculation.calculateModelConfiguration(model, []).total, model.priceFrom)
  const replanningOnly = calculation.calculateModelConfiguration(model, ['replanning'])
  assert.equal(replanningOnly.optionsSubtotal, replanningEligible ? 10000 : 0, `${model.id}: plan-change price is added once only where offered`)
  assert.equal(replanningOnly.total, model.priceFrom + (replanningEligible ? 10000 : 0))
  assert.equal(replanningOnly.selectedOptionIds.includes('replanning'), replanningEligible)
  const logisticsSelected = calculation.calculateModelConfiguration(model, ['delivery', 'crane-unload'])
  assert.deepEqual(JSON.parse(JSON.stringify(logisticsSelected.selectedOptionIds)), ['delivery', 'crane-unload'])
  assert.equal(logisticsSelected.logisticsSubtotal, 0, `${model.id}: no district means no fixed logistics tariff`)
  assert.equal(logisticsSelected.unpricedCount, 2)
  const logisticsRamensky = calculation.calculateModelConfiguration(model, ['delivery', 'crane-unload'], { deliveryDistrict: 'ramenskoe', deliveryAddress: 'Раменский район' })
  assert.equal(logisticsRamensky.logisticsSubtotal, 45_000)
  assert.equal(logisticsRamensky.equipmentSubtotal, 0)
  assert.equal(logisticsRamensky.total, model.priceFrom + 45_000)
  const logisticsOutside = calculation.calculateModelConfiguration(model, ['delivery', 'crane-unload'], { deliveryDistrict: 'outside', deliveryAddress: 'Раменское' })
  assert.equal(logisticsOutside.logisticsSubtotal, 0, 'free-text address cannot override the manually chosen outside district')
  assert.equal(logisticsOutside.unpricedCount, 2)
  assert.deepEqual(JSON.parse(JSON.stringify(logisticsOutside.individualItems)), ['delivery', 'crane-unload'])
  const logisticsNote = calculation.configurationManagerText(logisticsOutside).replace(/[\u00a0\u202f]/g, ' ')
  assert.ok(logisticsNote.includes('Район: За пределами Раменского района') && logisticsNote.includes('Стоимость по согласованию'))
  assert.ok(logisticsNote.includes('Индивидуальный расчёт') && logisticsNote.includes('Предварительная сумма без позиций индивидуального расчёта'), logisticsNote)
  const heightTwo = calculation.calculateModelConfiguration(model, ['ceiling-height'], { quantities: { 'ceiling-height': 2 } })
  const heightOutOfRange = calculation.calculateModelConfiguration(model, ['ceiling-height'], { quantities: { 'ceiling-height': 3 } })
  const heightZero = calculation.calculateModelConfiguration(model, ['ceiling-height'], { quantities: { 'ceiling-height': 0 } })
  assert.equal(heightZero.selectedOptionIds.length, 0, '0 cm means no ceiling-height option')
  assert.equal(heightZero.optionsSubtotal, 0)
  assert.equal(heightTwo.options[0].quantity, 2)
  assert.equal(heightTwo.optionsSubtotal, 44_000, 'the maximum +20 cm option is two 22 000 RUB steps')
  assert.equal(heightOutOfRange.options[0].quantity, 2, 'quantity above +20 cm must be clamped')
  assert.equal(heightOutOfRange.optionsSubtotal, 44_000)
  const windowEstimate = calculation.calculateModelConfiguration(model, ['wooden-window-600'])
  assert.deepEqual(JSON.parse(JSON.stringify(windowEstimate.selectedOptionIds)), ['wooden-window-600'], `${model.id}: unknown wooden-window compatibility is selectable as an estimate`)
  assert.equal(windowEstimate.total, model.priceFrom + 7_000)
  for (const item of items) {
    assert.ok(['available', 'included', 'unavailable', 'unknown'].includes(item.status))
    assert.ok(item.source && item.reason)
    if (item.status === 'included' || item.status === 'unavailable') assert.ok(!calculated.selectedOptionIds.includes(item.option.id))
    if (item.status === 'unknown') assert.ok(calculation.calculateModelConfiguration(model, [item.option.id]).selectedOptionIds.includes(item.option.id), `${model.id}/${item.option.id}: estimate-only option remains selectable`)
    if (!unitOnly && !premium && item.status === 'unknown') {
      const tag = html.match(new RegExp(`<article\\b[^>]*data-option-id="${item.option.id}"[^>]*>`))?.[0]
      assert.ok(tag?.includes('data-option-selectable="true"'), `${model.id}/${item.option.id}: estimate-only row must be selectable`)
    }
    if (!unitOnly && !premium && item.status === 'unknown') {
      const tag = html.match(new RegExp(`<article\\b[^>]*data-option-id="${item.option.id}"[^>]*>`))?.[0]
      assert.ok(tag?.includes('data-option-selectable="true"'), `${model.id}/${item.option.id}: estimate-only row must be selectable`)
    }
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
assert.equal(totals.available + totals.included + totals.unavailable + totals.unknown, 24 * 45 + 7 * 44, 'matrix must cover 45 options for eligible saunas and 44 for Barn Premium plus six homes')
assert.equal(totals.included, 47, 'only catalogue-confirmed options already in the model are classified as included; the free gift furniture is not the paid furniture option')
assert.equal(totals.unavailable, 0, 'current sources confirm no incompatible option; do not invent unavailable rows')
assert.ok(totals.available > 0 && totals.unknown > 0, 'matrix must distinguish confirmed availability from confirmation-needed positions')

const planless = matrix.filter(model => ['bg-25', 'bg-26', 'bg-27'].includes(model.id))
assert.equal(planless.length, 3)
for (const model of planless) {
  assert.equal(model.counts.available, 3, `${model.id}: the district-priced services and assembly are available without a plan`)
  assert.equal(model.counts.unknown, 41, `${model.id}: the unpriced plan-change service is excluded from this house model`)
}
const availableCounts = new Set(matrix.map(model => model.counts.available))
assert.ok(availableCounts.size >= 4, 'compatibility matrix must differ between models, not show one identical option list')
const evidence = id => matrix.find(model => model.id === id).rows
assert.equal(evidence('bg-01').find(row => row.option === 'furniture').status, 'available', 'gift table and benches do not make additional paid furniture included')
assert.equal(evidence('bg-04').find(row => row.option === 'ermak').status, 'unknown')
assert.equal(evidence('bg-09').find(row => row.option === 'ermak-base').status, 'included')
assert.equal(evidence('bg-18').find(row => row.option === 'external-light').status, 'included')
assert.equal(evidence('bg-18').find(row => row.option === 'shade').status, 'included')
assert.equal(evidence('bg-19').find(row => row.option === 'boiler').status, 'included')
assert.equal(evidence('bg-19').find(row => row.option === 'shower').status, 'included')
assert.equal(evidence('bg-20').find(row => row.option === 'wc').status, 'included')
assert.equal(evidence('bg-21').find(row => row.option === 'floor').status, 'included')
assert.equal(evidence('bg-23').find(row => row.option === 'floor').status, 'included')
assert.equal(evidence('bg-24').find(row => row.option === 'ermak-base').status, 'included')
assert.equal(evidence('bg-28').find(row => row.option === 'boiler').status, 'included')
assert.equal(evidence('bg-04').find(row => row.option === 'boiler').status, 'available')
assert.equal(evidence('bg-09').find(row => row.option === 'shower').status, 'unknown')
assert.equal(evidence('bg-19').find(row => row.option === 'ermak').status, 'unknown')
assert.equal(evidence('bg-04').find(row => row.option === 'tray').status, 'available')
for (const model of matrix) {
  for (const id of ['wooden-window-600', 'wooden-window-400']) assert.equal(model.rows.find(row => row.option === id).status, 'unknown', `${model.id}/${id}: do not infer compatibility or opening dimensions`)
  for (const id of ['delivery', 'crane-unload']) assert.equal(model.rows.find(row => row.option === id).status, 'available', `${model.id}/${id}: logistics is independent of building plan compatibility`)
}

const managerModel = models.find(model => model.id === 'bg-01')
const managerText = calculation.configurationManagerText(calculation.calculateModelConfiguration(managerModel, ['boiler', 'decor'])).replace(/[\u00a0\u202f]/g, ' ')
const managerBasePrice = managerModel.priceFrom.toLocaleString('ru-RU').replace(/[\u00a0\u202f]/g, ' ')
for (const expected of ['Комплектация: Исток 4', `Базовая стоимость: ${managerBasePrice} ₽`, 'Бойлер 50 л', 'Декоративные решётки', 'Итого:'])
  assert.ok(managerText.includes(expected), `manager configuration text is missing ${expected}`)
assert.ok(calculation.configurationManagerText(calculation.calculateModelConfiguration(models.find(model => model.id === 'bg-01'), [])).includes('не выбраны'))
const managerConfiguration = calculation.configurationManagerText(calculation.calculateModelConfiguration(models.find(model => model.id === 'bg-01'), ['boiler', 'decor', 'led']))
const merged = calculation.mergeManagerComment('Перезвоните после 18:00', managerConfiguration)
assert.ok(merged.length <= 1500, 'manager comment must fit the server limit')
assert.ok(merged.includes('Перезвоните после 18:00') && merged.includes('Комплектация: Исток 4') && merged.includes('Бойлер 50 л') && merged.includes('Итого:'), 'manager comment must keep both the client text and the configuration')
assert.throws(() => calculation.mergeManagerComment('Я'.repeat(2000), managerConfiguration), /1500/, 'oversized manager note must be rejected rather than truncating the selected configuration')
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
