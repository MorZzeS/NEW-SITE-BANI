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
const { modelBaseConfiguration } = readData('src/data/model-configuration.ts')
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
    const requiresConfirmation = /согласу(?:ется|ются) при заказе|состав подтверждается при заказе|нет подтверждённой/i.test(row.value)
    assert(card[0].includes(`data-base-included="${requiresConfirmation ? 'false' : 'true'}"`), `${model.id}: incorrect inclusion status: ${row.label}`)
    const isGift = /(?:^|[\s—])в подарок(?:$|[\s.,;—])/i.test(row.value)
    assert.equal(card[0].includes('data-base-gift="true"'), isGift, `${model.id}: gift status differs from source: ${row.label}`)
  }
  const hasPendingRows = expectedRows.some(row => /согласу(?:ется|ются) при заказе|состав подтверждается при заказе|нет подтверждённой/i.test(row.value))
  const baseLead = clean(block.match(/<p[^>]*class="[^"]*baseLead[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '')
  assert.equal(baseLead, hasPendingRows
    ? 'Подтверждённые позиции входят в базовую стоимость. Параметры для согласования указаны отдельно ниже.'
    : 'Всё перечисленное входит в базовую стоимость модели.', `${model.id}: base-price disclosure must match the verified row set`)
  const n = Number(model.id.slice(3))
  const unconfirmedHome = [25,26,27].includes(n)
  if (!unconfirmedHome) {
    assert.match(text,/Утепление Стены, пол и потолок — минеральная вата 100 мм \(ISOVER, URSA или аналог\)/)
    assert.match(text,/Мебель В подарок Стол и две лавки — в подарок/)
  } else {
    assert.match(text,/Согласуется при заказе/)
    for (const unsupported of ['100 мм', 'Осиновая', 'Печь', 'Стол и две лавки — в подарок']) assert(!text.includes(unsupported), `${model.id}: unconfirmed home specification must not assert ${unsupported}`)
  }
  assert(!/(?<!\d)50\s*мм/.test(clean(html)), `${model.id}: outdated visible insulation`)
  const construction = block.match(/<div[^>]*data-base-label="Конструкция"[^>]*>[\s\S]*?<dd[^>]*>([\s\S]*?)<\/dd>/)?.[1]
  if (unconfirmedHome) {
    assert(!model.floorPlan)
    assert.equal(clean(construction ?? ''),'Исполнение по утверждённому проекту модели')
    assert.match(text,/Планировка и комплектация Уточнить В каталоге нет подтверждённой планировки и комплектации; состав подтверждается при заказе/)
  } else assert.equal(clean(construction ?? ''), n === 31 ? 'Брус 90×140 мм' : n <= 17 || [29,30].includes(n) ? 'Каркас 100 мм' : 'Исполнение по утверждённому проекту модели')
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
console.log(JSON.stringify({ models:31, confirmedInsulation100:28, unconfirmedHomeSpecs:3, prices, printableSheets:31, realInteriors:photos.length, status:'PASS' },null,2))
