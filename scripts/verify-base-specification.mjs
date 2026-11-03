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
const clean = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim()
let prices = 0
for (const model of [...saunas,...homes]) {
  const route = `${saunas.includes(model) ? 'banya' : 'dom'}/${model.slug}`
  const html = fs.readFileSync(path.join(dist,route+'.html'),'utf8')
  const block = html.match(/<section[^>]*data-model-config="[^"]+"[^>]*>([\s\S]*?)<\/section>/)?.[1]
  assert(block, `${model.id}: missing base specification`)
  const rows = block.match(/<dl[^>]*>([\s\S]*?)<\/dl>/)?.[1]
  assert(rows, `${model.id}: missing base specification rows`)
  const text = clean(rows)
  const n = Number(model.id.slice(3))
  const unconfirmedHome = [25,26,27].includes(n)
  if (!unconfirmedHome) {
    assert.match(text,/Утепление Стены, пол и потолок — минеральная вата 100 мм \(ISOVER, URSA или аналог\)/)
    assert.match(text,/Мебель Стол и две лавки — в подарок/)
  } else {
    assert.match(text,/Согласуется при заказе/)
    for (const unsupported of ['100 мм', 'Осиновая', 'Печь', 'Стол и две лавки — в подарок']) assert(!text.includes(unsupported), `${model.id}: unconfirmed home specification must not assert ${unsupported}`)
  }
  assert(!/(?<!\d)50\s*мм/.test(clean(html)), `${model.id}: outdated visible insulation`)
  const construction = block.match(/<dt[^>]*>[\s\S]*?Конструкция<\/dt><dd>([^<]+)<\/dd>/)?.[1]
  if (unconfirmedHome) {
    assert(!model.floorPlan)
    assert.equal(construction,'Исполнение по утверждённому проекту модели')
    assert.match(text,/Планировка и комплектация В каталоге нет подтверждённой планировки и комплектации; состав подтверждается при заказе/)
  } else assert.equal(construction, n === 31 ? 'Брус 90×140 мм' : n <= 17 || [29,30].includes(n) ? 'Каркас 100 мм' : 'Исполнение по утверждённому проекту модели')
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
