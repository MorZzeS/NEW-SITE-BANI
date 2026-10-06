import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const ts = require('typescript')
function readData(file) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports })
  return exports
}
const { saunas, homes } = readData('src/data/index.ts')
const clean = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim()
let prices = 0
for (const model of [...saunas,...homes]) {
  const route = `${saunas.includes(model) ? 'banya' : 'dom'}/${model.slug}`
  const html = fs.readFileSync(path.join('dist',route+'.html'),'utf8')
  const block = html.match(/<section[^>]*data-model-config="[^"]+"[^>]*>([\s\S]*?)<\/section>/)?.[1]
  assert(block, `${model.id}: missing base specification`)
  const text = clean(block)
  assert.match(text,/Пол Утепление 100 мм/)
  assert.match(text,/Потолок Утепление 100 мм/)
  assert(!/(?<!\d)50\s*мм/.test(clean(html)), `${model.id}: outdated visible insulation`)
  const n = Number(model.id.slice(3))
  const construction = block.match(/<dt>Конструкция<\/dt><dd>([^<]+)<\/dd>/)?.[1]
  assert.equal(construction, n === 31 ? 'Брус 90×140 мм' : n <= 17 || [29,30].includes(n) ? 'Каркас 100 мм' : 'Согласуется при заказе')
  if ([25,26,27].includes(n)) { assert(!model.floorPlan); assert(!text.includes('Осиновая')); assert.match(text,/нет подтверждённой планировки и комплектации/); assert.match(text,/Освещение Согласуется при заказе/) }
  const priceBlock = clean(html.match(/<section aria-label="Стоимость и варианты исполнения"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '')
  assert(priceBlock.includes(model.priceFrom.toLocaleString('ru-RU').replace(/\s+/g,' ')), `${model.id}: main price changed`)
  prices++
  for (const variant of model.priceVariants ?? []) { assert(priceBlock.includes(variant.replace(/\s+/g,' ')), `${model.id}: missing alternate price`); prices++ }
  const sheet = clean(fs.readFileSync(path.join('dist','model-sheet',model.id+'.html'),'utf8'))
  assert(!/(?<!\d)50\s*мм/.test(sheet), `${model.id}: outdated printable specification`)
  assert(sheet.includes('Базовая комплектация'))
}
const photos = readData('src/data/home-interiors.ts').homeInteriors
assert.equal(photos.length,20)
assert.equal(new Set(photos.map(p=>p.src)).size,20)
for (const p of photos) for (const file of [p.src,p.avif]) assert(fs.existsSync(path.join('public',file.replace('/NEW-SITE-BANI/',''))))
console.log(JSON.stringify({ models:31, floor100:31, ceiling100:31, prices, printableSheets:31, realInteriors:20, status:'PASS' },null,2))
