import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const root = path.resolve(import.meta.dirname, '..')
const cache = new Map()
const captured = []
const { jsPDF: RealPdf } = require('jspdf')
function CapturingPdf(...args) {
  const doc = new RealPdf(...args), text = doc.text.bind(doc)
  doc.text = (value, ...rest) => { captured.push(String(value)); return text(value, ...rest) }
  return doc
}
function compile(file, source = fs.readFileSync(path.join(root, file), 'utf8')) {
  const module = { exports: {} }
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    module, exports: module.exports, require: name => {
      if (name === '@/data') return load('src/data/index.ts')
      if (name === 'jspdf') return { jsPDF: CapturingPdf }
      if (name.startsWith('@/')) return load('src/' + name.slice(2) + '.ts')
      throw Error('Unexpected import: ' + name)
    }, process: { env: {} }, URL, console,
  }, { filename: file })
  return module.exports
}
function load(file) { if (!cache.has(file)) cache.set(file, compile(file)); return cache.get(file) }
const data = load('src/data/index.ts')
const options = load('src/data/options.ts').additionalOptions
const baseline = compile('baseline', execFileSync('git', ['show', '714da378:src/data/options.ts'], { cwd: root, encoding: 'utf8' })).additionalOptions
const { calculateModelConfiguration: calculate, configurationManagerText, mergeManagerComment } = load('src/lib/model-configuration-selection.ts')
const { equipmentSelection } = load('src/lib/equipment-selection.ts')
const { modelOptionAvailability } = load('src/lib/model-option-availability.ts')
const models = [...data.saunas, ...data.homes]
const baseConfiguration = load('src/data/model-configuration.ts')
for (const model of models) {
  const rows = baseConfiguration.modelBaseConfiguration(model)
  const values = rows.map(row => row.value).join(' ')
  if (data.homes.includes(model)) {
    assert.match(rows.find(row => row.label === 'Утепление').value, /Пол и потолок — минеральная вата 100 мм/)
    assert.ok(!/осин|Бак для воды и камни|Стол и две лавки|Ермак/i.test(values), model.id + ': do not inherit mobile-bath interior, gifts, furniture or stove')
    for (const row of rows.filter(row => !['Конструкция', 'Формат', 'Помещения', 'Утепление'].includes(row.label))) {
      assert.ok(baseConfiguration.requiresBaseConfigurationConfirmation(row.value), model.id + ': undocumented home row must remain pending: ' + row.label)
    }
    if (['bg-25', 'bg-26', 'bg-27'].includes(model.id)) {
      assert.equal(rows.find(row => row.label === 'Конструкция').value, 'Согласуется при заказе')
      assert.ok(!model.floorPlan)
      if (model.id === 'bg-27') assert.match(rows.find(row => row.label === 'Помещения').value, /Баня с верандой/)
      else assert.equal(rows.find(row => row.label === 'Помещения').value, 'Согласуется при заказе')
    } else {
      assert.ok(model.floorPlan)
      assert.ok(/Парная/.test(rows.find(row => row.label === 'Помещения').value))
      assert.ok(/Комната отдыха/.test(rows.find(row => row.label === 'Помещения').value))
    }
  } else {
    const construction = rows.find(row => row.label === 'Конструкция').value
    if (Number(model.id.slice(3)) >= 18) assert.ok(baseConfiguration.requiresBaseConfigurationConfirmation(construction), model.id + ': unconfirmed construction must be marked pending')
    const furniture = rows.find(row => row.label === 'Мебель')?.value
    if (Number(model.id.slice(3)) <= 8) assert.match(furniture ?? '', /Стол и две лавки — в подарок/)
    else if (Number(model.id.slice(3)) <= 27) assert.ok(baseConfiguration.requiresBaseConfigurationConfirmation(furniture ?? ''), model.id + ': unverified furniture must not be called a gift')
  }
  if (model.id === 'bg-28') {
    assert.match(values, /Чугунная печь ЭТНА 18/)
    assert.match(values, /Душевая кабина и бойлер 50 л/)
    assert.ok(!values.includes('— в подарок'), 'Barn Premium gifts must not be inferred from standard bath package')
  }
}
assert.equal(models.length, 31)
assert.equal(options.length, 27)
assert.equal(new Set(options.map(option => option.id)).size, 27)
for (const option of baseline) assert.equal(options.find(item => item.id === option.id).salePrice, option.id === 'tray' ? 18000 : option.salePrice, option.id + ': approved prices must remain unchanged')
assert.equal(options.find(option => option.id === 'tray').name, 'Душевой поддон со шторкой и выводом воды')
assert.equal(options.find(option => option.id === 'wc').salePrice, 20600)

let cases = 0
for (const model of models) {
  const rows = modelOptionAvailability(model)
  for (const district of ['unknown', 'outside', 'ramenskoe']) {
    for (const ids of [[], ['delivery'], ['crane-unload'], ['delivery', 'crane-unload', 'delivery']]) {
      const input = { deliveryDistrict: district, deliveryAddress: 'Ручной адрес, участок 10' }
      const result = calculate(model, ids, input)
      const expected = district === 'ramenskoe' ? (ids.includes('delivery') ? 20000 : 0) + (ids.includes('crane-unload') ? 25000 : 0) : 0
      assert.equal(result.logisticsSubtotal, expected)
      assert.equal(result.equipmentSubtotal, 0)
      assert.equal(result.total, model.priceFrom + expected)
      assert.equal(result.options.length, new Set(ids).size)
      assert.equal(result.unpricedCount, district === 'ramenskoe' ? 0 : new Set(ids).size)
      assert.equal(result.individualItems.length, result.unpricedCount)
      for (const option of result.options) assert.equal(option.price, district === 'ramenskoe' ? (option.id === 'delivery' ? 20000 : 25000) : null)
      const global = equipmentSelection(ids, {}, input)
      assert.equal(global.knownTotal, expected)
      assert.equal(global.logisticsSubtotal, expected)
      const note = configurationManagerText(result)
      assert.ok(note.includes('Ручной адрес, участок 10'))
      assert.ok(note.includes('Итого:'))
      for (const id of new Set(ids)) assert.ok(note.includes(options.find(option => option.id === id).name))
      if (result.unpricedCount) assert.ok(note.includes('Индивидуальный расчёт') && note.includes('Предварительная сумма'))
      cases++
    }
  }
  assert.equal(calculate(model, ['ceiling-height'], { quantities: { 'ceiling-height': 0 } }).optionsSubtotal, 0, 'zero steps means standard height')
  assert.equal(equipmentSelection(['ceiling-height'], { 'ceiling-height': 0 }).knownTotal, 0)
  for (const steps of [1, 2, 3, 100, -3, NaN, Infinity]) {
    const expected = Number.isFinite(steps) ? Math.max(1, Math.min(2, Math.floor(steps))) : 1
    const result = calculate(model, ['ceiling-height'], { quantities: { 'ceiling-height': steps } })
    assert.equal(result.options[0].quantity, expected)
    assert.equal(result.optionsSubtotal, expected * 22000)
    assert.equal(equipmentSelection(['ceiling-height'], { 'ceiling-height': steps }).knownTotal, expected * 22000)
  }
  const maximal = calculate(model, options.map(option => option.id), { deliveryDistrict: 'outside', deliveryAddress: 'А'.repeat(300), quantities: { 'ceiling-height': 2 } })
  assert.ok(configurationManagerText(maximal, true).length <= 1500, model.id + ': maximal summary must fit legacy: ' + configurationManagerText(maximal, true).length)
  const windows = calculate(model, ['wooden-window-600', 'wooden-window-400'])
  assert.equal(windows.equipmentSubtotal, 12500)
  assert.ok(rows.filter(row => row.option.id.startsWith('wooden-window')).every(row => row.status === 'unknown'), 'window fit must never be invented')
  const sanitary = calculate(model, ['wc'])
  assert.equal(sanitary.optionsSubtotal, rows.find(row => row.option.id === 'wc').status === 'included' ? 0 : 20600)
  const included = rows.filter(row => row.status === 'included').map(row => row.option.id)
  assert.equal(calculate(model, included).options.length, 0, 'included options cannot be paid twice')
  assert.equal(calculate(model, [], { promotionalDiscount: true }).discount, 'series' in model ? 15000 : 0)
}
const addressOnly = equipmentSelection([], {}, { deliveryDistrict: 'outside', deliveryAddress: 'Адрес без выбранных услуг' })
assert.ok(addressOnly.comment.includes('Адрес без выбранных услуг') && addressOnly.comment.includes('За пределами Раменского района'))
assert.ok(equipmentSelection([], {}, { deliveryDistrict: 'outside' }).comment.includes('За пределами Раменского района'))
assert.ok(configurationManagerText(calculate(models[0], [], { deliveryDistrict: 'outside' })).includes('За пределами Раменского района'))
const invalidDistrict = calculate(models[0], ['delivery', 'crane-unload'], { deliveryDistrict: 'RAMENSKOE' })
assert.equal(invalidDistrict.logisticsSubtotal, 0)
assert.equal(invalidDistrict.deliveryDistrict, 'unknown')
const all = calculate(models[0], options.map(option => option.id), { deliveryDistrict: 'outside' })
const completeNote = configurationManagerText(all)
assert.ok(completeNote.includes('\n'), 'manager note must contain actual newlines')
assert.equal(mergeManagerComment('', completeNote, 5000), completeNote)
assert.throws(() => mergeManagerComment('Я'.repeat(1500), completeNote), /1500/, 'oversize notes must fail explicitly, never silently omit selections')
const maximum = calculate(models[0], options.map(option => option.id), { deliveryDistrict: 'outside', deliveryAddress: 'А'.repeat(300), quantities: { 'ceiling-height': 2 } })
const compactNote = configurationManagerText(maximum, true)
assert.ok(compactNote.length <= 1500, 'maximal configuration + address300 must fit legacy comment')
assert.equal(mergeManagerComment('', compactNote), compactNote)
assert.ok(compactNote.includes('А'.repeat(300)))
assert.ok(compactNote.includes(maximum.total.toLocaleString('ru-RU')))
for (const option of maximum.options) assert.ok(compactNote.includes(load('src/lib/logistics.ts').managerOptionName(option, true)), option.id + ': compact note must preserve every selected item')
assert.ok(equipmentSelection(options.map(option => option.id), { 'ceiling-height': 2 }, { deliveryDistrict: 'outside', deliveryAddress: 'А'.repeat(300) }).comment.length <= 1500)
const formSource = fs.readFileSync(path.join(root, 'src/components/forms/OnlineLeadForm.tsx'), 'utf8')
assert.ok(formSource.includes('leadContract === 3 && configurationDetails'), 'new configuration schema must not leak into legacy payload')
assert.ok(formSource.indexOf('mergeManagerComment(comment.trim(), managerConfiguration)') < formSource.indexOf('await sendLead(attempt.current)'), 'bounded complete comment checked before sending')

// Exercise the actual jsPDF layout and Cyrillic font without browser fetches or real lead submissions.
const { createModelPdf } = load('src/lib/model-pdf.ts')
const font = fs.readFileSync(path.join(root, 'public/fonts/NotoSans-Regular.ttf')).toString('base64')
let pdfCases = 0
for (const district of ['unknown', 'outside', 'ramenskoe']) {
  captured.length = 0
  const configuration = calculate(models[0], ['delivery', 'crane-unload', 'ceiling-height', 'tray', 'wooden-window-600', 'wooden-window-400', 'larch-wash'], { deliveryDistrict: district, deliveryAddress: 'Адрес участка 10', quantities: { 'ceiling-height': 2 } })
  const doc = createModelPdf(models[0], configuration, { font, images: {} }, new Date('2026-11-03T12:00:00Z'))
  const text = captured.join('\n').replace(/[\u00a0\u202f]/g, ' ')
  for (const fragment of ['Адрес участка 10', 'Доставка', 'Разгрузка краном', 'Деревянное окно 600', 'Деревянное окно 400', 'Душевой поддон', 'Дополнительное оборудование', 'Логистические услуги', '44 000', configuration.total.toLocaleString('ru-RU').replace(/[\u00a0\u202f]/g, ' ')]) assert.ok(text.includes(fragment), district + ': PDF missing ' + fragment)
  assert.ok(text.includes('Индивидуальный расчёт'))
  assert.ok(doc.getNumberOfPages() >= 2)
  assert.ok(doc.output('arraybuffer').byteLength > 10000)
  pdfCases++
}
console.log(JSON.stringify({ status: 'PASS', models: models.length, options: options.length, districtCombinationCases: cases, pdfCases, priceBaseline: '714da378; only tray changed to approved 18000', posts: 0, notChecked: ['browser visual layout', 'PDF image loading and visual page rendering', 'external MAX delivery'] }, null, 2))
