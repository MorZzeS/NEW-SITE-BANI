import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = require(path.join(root, 'next.config.js'))
const dist = path.join(root, config.distDir || 'dist')
function readData(file) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports })
  return exports
}
const { saunas, homes } = readData('src/data/index.ts')
const { modelBaseConfiguration, requiresBaseConfigurationConfirmation } = readData('src/data/model-configuration.ts')
const clean = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim()
let prices = 0
for (const model of [...saunas,...homes]) {
  const route = `${saunas.includes(model) ? 'banya' : 'dom'}/${model.slug}`
  const html = fs.readFileSync(path.join(dist,route+'.html'),'utf8')
  const blockStart = html.indexOf(`data-model-config="${model.id}"`)
  const calculatorStart = html.indexOf(`data-model-option-calculator="${model.id}"`, blockStart)
  const block = blockStart >= 0 && calculatorStart > blockStart ? html.slice(blockStart, calculatorStart) : undefined
  assert(block, `${model.id}: missing base specification`)
  const text = clean(block)
  const expectedRows = modelBaseConfiguration(model)
  assert(expectedRows.length > 0, `${model.id}: source base specification is empty`)
  for (const row of expectedRows) {
    const escapedLabel = row.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const card = block.match(new RegExp(`<div[^>]*data-base-label="${escapedLabel}"[^>]*>([\\s\\S]*?)</div>`))
    assert(card, `${model.id}: base row missing: ${row.label}`)
    const description = card[1].match(/<dd[^>]*>([\s\S]*?)<\/dd>/)?.[1]
    assert(description, `${model.id}: base row value missing: ${row.label}`)
    assert.equal(clean(description), clean(row.value), `${model.id}: base row value changed: ${row.label}`)
    const requiresConfirmation = requiresBaseConfigurationConfirmation(row.value)
    assert(card[0].includes(`data-base-included="${requiresConfirmation ? 'false' : 'true'}"`), `${model.id}: incorrect inclusion status: ${row.label}`)
    const isGift = /(?:^|[\s—])в подарок(?:$|[\s.,;—])/i.test(row.value)
    assert.equal(card[0].includes('data-base-gift="true"'), isGift, `${model.id}: gift status differs from source: ${row.label}`)
    if (requiresConfirmation) assert.match(clean(card[0]), /Уточнить/, `${model.id}: pending row must be labelled`)
    else if (isGift) assert.match(clean(card[0]), /В подарок/, `${model.id}: gift row must be labelled separately`)
    else assert.match(clean(card[0]), /Включено в базовую комплектацию/, `${model.id}: included row must be labelled`)
  }
  const hasPendingRows = expectedRows.some(row => requiresBaseConfigurationConfirmation(row.value))
  const baseLead = clean(block.match(/<p[^>]*class="[^"]*baseLead[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '')
  assert.equal(baseLead, hasPendingRows
    ? 'Подтверждённые позиции входят в базовую стоимость. Параметры для согласования указаны отдельно ниже.'
    : 'Всё перечисленное входит в базовую стоимость модели.', `${model.id}: base-price disclosure must match the verified row set`)
  const n = Number(model.id.slice(3))
  if (homes.includes(model)) {
    const row = (label) => expectedRows.find(item => item.label === label)?.value ?? ''
    assert.match(row('Утепление'), /Пол и потолок — минеральная вата 100 мм/)
    assert(!text.includes('Осиновая'), `${model.id}: mobile-bath interior must not be copied to a home`)
    assert(!text.includes('Бак для воды и камни для печи'), `${model.id}: mobile-bath stove gifts must not be copied to a home`)
    assert(!text.includes('Стол и две лавки'), `${model.id}: unconfirmed home furniture must not be shown as a gift`)
    for (const item of expectedRows.filter(item => !['Конструкция', 'Формат', 'Помещения', 'Утепление'].includes(item.label))) {
      assert(requiresBaseConfigurationConfirmation(item.value), `${model.id}: unsupported house detail must stay pending (${item.label})`)
    }
    if (n >= 25 && n <= 27) {
      assert(!model.floorPlan)
      assert.equal(row('Конструкция'), 'Согласуется при заказе')
      if (n === 27) assert.match(row('Помещения'), /Баня с верандой/)
      else assert.equal(row('Помещения'), 'Согласуется при заказе')
    } else {
      assert.equal(row('Конструкция'), n === 31 ? 'Брус 90×140 мм' : 'Каркас 100 мм')
      assert.match(row('Помещения'), /Парная, моечная и санузел/)
      assert.match(row('Помещения'), /Комната отдыха/)
    }
  } else if (n <= 8) {
    assert.match(text,/Утепление Включено в базовую комплектацию Стены, пол и потолок — минеральная вата 100 мм/)
    assert.match(text,/Мебель В подарок Стол и две лавки — в подарок/)
  } else if (n <= 27) {
    const furniture = expectedRows.find(item => item.label === 'Мебель')?.value ?? ''
    assert(requiresBaseConfigurationConfirmation(furniture), `${model.id}: furniture gift must only appear where confirmed by source`)
  }
  if (n >= 18 && n <= 28) assert(requiresBaseConfigurationConfirmation(expectedRows.find(item => item.label === 'Конструкция')?.value ?? ''), `${model.id}: unconfirmed construction must not be guaranteed`)
  if (!homes.includes(model) && n >= 9 && n <= 27) assert(requiresBaseConfigurationConfirmation(expectedRows.find(item => item.label === 'Мебель')?.value ?? ''), `${model.id}: unverified furniture must not be called a gift`)
  if (n === 28) {
    assert.match(text,/Чугунная печь ЭТНА 18/)
    assert.match(text,/Душевая кабина и бойлер 50 л/)
    assert(!expectedRows.some(row => row.label === 'Представленное исполнение'), 'BG-28 explanatory text must not be presented as included equipment')
    assert(!text.includes('Бак для воды и камни для печи — в подарок'))
  }
  assert(!/(?<!\d)50\s*мм/.test(clean(html)), `${model.id}: outdated visible insulation`)
  const construction = block.match(/<div[^>]*data-base-label="Конструкция"[^>]*>[\s\S]*?<dd[^>]*>([\s\S]*?)<\/dd>/)?.[1]
  if (n >= 25 && n <= 27) assert.equal(clean(construction ?? ''), 'Согласуется при заказе')
  else if ((n >= 18 && n <= 24) || n === 28) assert.equal(clean(construction ?? ''), 'Тип конструкции согласуется при заказе')
  else assert.equal(clean(construction ?? ''), n === 31 ? 'Брус 90×140 мм' : 'Каркас 100 мм')
  const priceBlock = clean(html.match(/<section aria-label="Стоимость и варианты исполнения"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '')
  const mainPrice = model.priceFrom.toLocaleString('ru-RU').replace(/\s+/g,' ')
  assert(priceBlock.includes(`Базовая комплектация — ${mainPrice} ₽`), `${model.id}: fixed base price must render as "Базовая комплектация — ${mainPrice} ₽"`)
  assert(!priceBlock.includes(`от ${mainPrice}`), `${model.id}: fixed base price must not use "от"`)
  prices++
  for (const variant of model.priceVariants ?? []) { assert(priceBlock.includes(variant.replace(/\s+/g,' ')), `${model.id}: missing alternate price`); prices++ }
  const sheet = clean(fs.readFileSync(path.join(dist,'model-sheet',model.id+'.html'),'utf8'))
  assert(!/(?<!\d)50\s*мм/.test(sheet), `${model.id}: outdated printable specification`)
  assert(sheet.includes('Базовая комплектация'))
}
const photos = readData('src/data/home-interiors.ts').homeInteriors
assert.equal(photos.length,19, 'approved home gallery excludes the rejected construction-site image')
assert.equal(new Set(photos.map(p=>p.src)).size,photos.length)
assert(!photos.some(p => /\/interior-10\.(?:webp|avif)$/.test(p.src) || /\/interior-10\.(?:webp|avif)$/.test(p.avif)), 'rejected interior-10 must not reappear')
for (const p of photos) for (const file of [p.src,p.avif]) assert(fs.existsSync(path.join(root,'public',file.replace(/^\//,''))))
console.log(JSON.stringify({ models:31, saunas:25, homes:6, unconfirmedHomeConstruction:[25,26,27], unconfirmedSaunaConstruction:[18,19,20,21,22,23,24,28], prices, printableSheets:31, realInteriors:photos.length, status:'PASS' },null,2))
