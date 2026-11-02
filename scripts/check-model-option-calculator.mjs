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
for (const model of models) {
  const isHome = data.homes.some(item => item.id === model.id)
  const relative = `${isHome ? 'dom' : 'banya'}/${model.slug}.html`
  const htmlPath = path.join(dist, relative)
  if (!unitOnly) assert.ok(fs.existsSync(htmlPath), `missing exported model page ${relative}`)
  const html = unitOnly ? '' : fs.readFileSync(htmlPath, 'utf8')
  if (!unitOnly) assert.ok(html.includes(`data-model-option-calculator="${model.id}"`), `${model.id}: calculator is not rendered`)
  assert.ok(html.includes(`data-base-price="${model.priceFrom}"`), `${model.id}: base price differs from model data`)
  const items = availability.modelOptionAvailability(model)
  assert.equal(items.length, enabled.length, `${model.id}: option list length mismatch`)
  const renderedIds = [...html.matchAll(/data-option-id="([^"]+)"/g)].map(match => match[1])
  if (!unitOnly) assert.equal(renderedIds.length, items.length, `${model.id}: not all options rendered`)
  assert.equal(new Set(renderedIds).size, renderedIds.length, `${model.id}: duplicate option row`)
  for (const item of items) {
    const image = guidance.optionGuidance[item.option.id]?.image
    assert.ok(image && fs.existsSync(path.join(root, 'public', image.replace(/^\//, ''))), `${model.id}/${item.option.id}: missing option photo or diagram`)
    if (!unitOnly && item.blockedReason) assert.ok(html.includes(item.blockedReason), `${model.id}/${item.option.id}: base-duplicate warning missing`)
  }
  const calculated = calculation.calculateModelConfiguration(model, [...enabled.map(option => option.id), 'unknown', 'boiler'])
  assert.equal(calculated.basePrice, model.priceFrom)
  assert.equal(calculated.total, model.priceFrom + calculated.optionsSubtotal)
  assert.equal(calculated.selectedOptionIds.length, new Set(calculated.selectedOptionIds).size)
  assert.ok(calculated.selectedOptionIds.every(id => items.find(item => item.option.id === id)?.status === 'available'))
  assert.equal(calculation.calculateModelConfiguration(model, []).total, model.priceFrom)
  for (const item of items) {
    assert.ok(['available', 'included', 'unavailable', 'unknown'].includes(item.status))
    assert.ok(item.source && item.reason)
    if (item.status !== 'available') assert.ok(!calculated.selectedOptionIds.includes(item.option.id))
  }
  checkedPages++
}

const boilerModel = models.find(model => availability.modelOptionAvailability(model).find(item => item.option.id === 'boiler')?.blockedReason)
const furnitureModel = models.find(model => availability.modelOptionAvailability(model).find(item => item.option.id === 'furniture')?.blockedReason)
const bathroomModel = models.find(model => availability.modelOptionAvailability(model).find(item => item.option.id === 'wc')?.blockedReason)
const stoveModel = models.find(model => availability.modelOptionAvailability(model).find(item => item.option.id === 'ermak')?.blockedReason)
assert.ok(boilerModel && furnitureModel && bathroomModel && stoveModel, 'known base-overlap cases must not be selectable as additive options')

console.log(JSON.stringify({
  status: 'PASS',
  models: checkedPages,
  optionsPerModel: enabled.length,
  modelPages: unitOnly ? 'not checked (--unit)' : checkedPages,
  compatibilityStates: Object.fromEntries(['available', 'included', 'unavailable', 'unknown'].map(status => [status, models.flatMap(availability.modelOptionAvailability).filter(item => item.status === status).length])),
  basePriceSource: 'model.priceFrom, unchanged',
  duplicateSelection: 'counted once',
  unpricedOption: 'excluded from total and disclosed',
  baseOverlapGuards: { boiler: boilerModel.id, furniture: furnitureModel.id, wc: bathroomModel.id, stoveReplacement: stoveModel.id },
}, null, 2))
