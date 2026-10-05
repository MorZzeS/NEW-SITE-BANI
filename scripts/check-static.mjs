import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = require(path.join(root, 'next.config.js'))
const prefix = config.basePath || ''
const dist = path.join(root, config.distDir || 'dist')
const origin = 'https://morzzes.github.io'
const errors = []
const urls = new Set()
const htmlFiles = []
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, item.name)
    if (item.isDirectory()) walk(target)
    else if (item.name.endsWith('.html')) htmlFiles.push(target)
  }
}
walk(dist)
function resolveFile(url) {
  const relative = decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^\/+/, '')
  const target = path.resolve(dist, relative)
  if (!target.startsWith(dist + path.sep) && target !== dist) return undefined
  return [target, target + '.html', path.join(target, 'index.html')]
    .find((file) => fs.existsSync(file) && fs.statSync(file).isFile())
}
for (const file of htmlFiles) {
  const relative = path.relative(dist, file).replaceAll(path.sep, '/')
  const pagePath = relative === 'index.html' ? '/' : '/' + relative.replace(/\.html$/, '')
  const html = fs.readFileSync(file, 'utf8')
  for (const tag of html.matchAll(/<(?:a|link|img|script|source|iframe)\b[^>]*>/gi)) {
    for (const attr of tag[0].matchAll(/\b(href|src)=["']([^"']+)["']/gi)) {
      const raw = attr[2].replaceAll('&amp;', '&')
      if (/^(?:#|tel:|mailto:|data:|javascript:)/i.test(raw)) continue
      const url = new URL(raw, origin + prefix + pagePath)
      if (url.origin !== origin) continue
      if (prefix && url.pathname !== prefix && !url.pathname.startsWith(prefix + '/')) {
        errors.push(`${relative}: missing basePath: ${raw}`)
        continue
      }
      const target = resolveFile(url)
      if (!target) errors.push(`${relative}: 404: ${raw}`)
      else urls.add(url.pathname)
      if (target && attr[1].toLowerCase() === 'href' && url.hash && target.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1))
        if (!fs.readFileSync(target, 'utf8').includes(`id="${id}"`)) errors.push(`${relative}: missing anchor ${raw}`)
      }
    }
  }
}
const records = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-plan-sources.json'), 'utf8'))
const ts = require('typescript')
const dataExports = {}
const dataJs = ts.transpileModule(fs.readFileSync(path.join(root, 'src/data/index.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
vm.runInNewContext(dataJs, { exports: dataExports })
const models = [...dataExports.saunas, ...dataExports.homes]
if (models.length !== 31 || new Set(models.map((m) => m.id)).size !== 31 || new Set(models.map((m) => m.slug)).size !== 31) errors.push('model IDs/slugs are not unique 31/31')
if (new Set(records.map((r) => r.model_source_sha256)).size !== 31) errors.push('duplicate catalog main image')
for (const record of records) {
  const card = path.join(dist, record.route + '.html')
  if (!fs.existsSync(card)) { errors.push(`${record.id}: missing card`); continue }
  const html = fs.readFileSync(card, 'utf8')
  const model = models.find((m) => m.id === record.id)
  for (const field of ['name', 'article', 'size', 'description', 'priceFrom', 'area']) {
    if (model?.[field] !== record[field]) errors.push(`${record.id}: data differs from catalog: ${field}`)
  }
  if (JSON.stringify(model?.features) !== JSON.stringify(record.features)) errors.push(`${record.id}: features differ from catalog`)
  const mainAsset = path.join(dist, record.model_asset)
  if (!fs.existsSync(mainAsset)) errors.push(`${record.id}: missing main model asset`)
  else if (crypto.createHash('sha256').update(fs.readFileSync(mainAsset)).digest('hex') !== record.model_source_sha256) errors.push(`${record.id}: main image differs from source slide`)
  if (model?.image !== prefix + '/' + record.model_asset || !html.includes(prefix + '/' + record.model_asset)) errors.push(`${record.id}: wrong main model image`)
  if (record.plan && model?.floorPlan !== prefix + '/' + record.asset) errors.push(`${record.id}: wrong floorPlan`)
  if (!record.plan && model?.floorPlan) errors.push(`${record.id}: artificial plan`)
  for (const item of record.additional_model_images || []) {
    const asset = path.join(dist, item.asset)
    if (!fs.existsSync(asset) || crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex') !== item.sha256) errors.push(`${record.id}: wrong owner-supplied photo`)
    if (!html.includes(prefix + '/' + item.asset)) errors.push(`${record.id}: additional owner photo not connected`)
  }

  if (record.plan) {
    const asset = path.join(dist, record.asset)
    if (!fs.existsSync(asset)) errors.push(`${record.id}: missing plan asset`)
    else if (crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex') !== record.source_image_sha256) errors.push(`${record.id}: plan differs from source`)
    if (!html.includes(prefix + '/' + record.asset)) errors.push(`${record.id}: plan not connected`)
    const plan = html.indexOf('>Галерея модели</h2>')
    const interior = html.search(/>(?:Интерьеры|Варианты внутреннего исполнения)<\/h2>/)
    if (plan === -1) errors.push(`${record.id}: missing model gallery heading`)
    if (interior !== -1 && plan !== -1 && interior < plan) errors.push(`${record.id}: interiors precede plan`)
  } else if (html.includes('/images/plans/' + record.id)) errors.push(`${record.id}: unexpected plan`)
}
const interiors = JSON.parse(fs.readFileSync(path.join(root, 'docs/interior-photo-sources.json'), 'utf8'))
for (const item of interiors) {
  const asset = path.join(dist, item.asset)
  if (!fs.existsSync(asset)) errors.push(`missing interior ${item.asset}`)
  else if (crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex') !== item.sha256) errors.push(`interior differs from source: ${item.asset}`)
}
for (const record of records) {
  const html = fs.readFileSync(path.join(dist, record.route + '.html'), 'utf8')
  if (/>(?:Планировка|Планировка модели)<\/h2>/.test(html)) errors.push(`${record.id}: duplicate standalone plan section`)
  if (!html.includes('>Варианты внутреннего исполнения</h2>')) errors.push(`${record.id}: missing interiors gallery`)
}
const baseUrlIndex = process.argv.indexOf('--base-url')
if (baseUrlIndex !== -1) {
  const baseUrl = process.argv[baseUrlIndex + 1]
  for (const pathname of urls) {
    try {
      const response = await fetch(new URL(pathname, baseUrl), { method: 'HEAD' })
      if (!response.ok) errors.push(`HTTP ${response.status}: ${pathname}`)
    } catch (error) { errors.push(`HTTP error ${pathname}: ${error.message}`) }
  }
}
console.log(JSON.stringify({ pages: htmlFiles.length, localUrls: urls.size, models: records.length, plans: records.filter((record) => record.plan).length, errors }, null, 2))
process.exitCode = errors.length ? 1 : 0
