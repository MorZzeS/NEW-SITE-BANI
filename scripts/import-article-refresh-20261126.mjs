import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { toArticleHtml } from './lib/article-markdown.mjs'
import { publicAssetUrl, resolvePublicTarget } from './lib/public-assets.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceJson = path.join(root, 'docs/editorial-assets/2026-11-26/articles.json')
const sourceMarkdown = path.join(root, 'docs/editorial-assets/2026-11-26/pochemu-karkasnaya-banya-manufacturing.md')
const manifestPath = path.join(root, 'docs/editorial-assets/2026-11-26/article-assets-manifest.json')
const dataPath = path.join(root, 'src/data/index.ts')
const source = fs.readFileSync(dataPath, 'utf8')
const articlePackage = JSON.parse(fs.readFileSync(sourceJson, 'utf8'))
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const manufacturingMarkdown = fs.readFileSync(sourceMarkdown, 'utf8')

const presentationBySlug = {
  'chto-proishodit-s-organizmom-v-bane': 'immersive',
  'kak-vybrat-drevesinu-dlya-mobilnoy-bani': 'checklist',
  'obrabotka-drevesiny-neomid-v-bane': 'reference',
  'materialy-dlya-mobilnoy-bani': 'anatomy',
  'podgotovka-ploshchadki-pod-mobilnuyu-banyu': 'process',
  'fundament-dlya-mobilnoy-bani-bloki-ili-svai': 'comparison',
  'karkas-ili-brus-dlya-bani': 'comparison',
  'pirog-steny-mobilnoy-bani': 'anatomy',
  'uteplenie-mobilnoy-bani-dlya-zimy': 'reference',
  'pol-i-sliv-v-bane': 'process',
  'ventilyatsiya-mobilnoy-bani': 'anatomy',
  'kak-vybrat-pech-dlya-mobilnoy-bani': 'comparison',
  'dymohod-v-derevyannoy-bane': 'checklist',
  'elektrika-v-bane': 'checklist',
  'voda-i-boyler-v-mobilnoy-bane': 'process',
  'otdelka-parnoy-i-polki': 'reference',
  'okna-i-dveri-v-bane': 'anatomy',
  'fasad-mobilnoy-bani': 'immersive',
  'dostavka-i-ustanovka-mobilnoy-bani': 'process',
  'kak-prinyat-mobilnuyu-banyu': 'checklist',
  'uhod-za-mobilnoy-baney': 'reference',
  'pochemu-karkasnaya-banya': 'process',
  'uteplenie-isover-ursa-bani': 'anatomy',
  'pochemu-ne-ispolzuem-epps-v-polu': 'comparison',
  'prolivnoy-pol-v-bane': 'anatomy',
  'otkrytaya-ili-zakrytaya-kamenka': 'comparison',
  'kakie-kamni-luchshe-dlya-bani': 'reference',
  'parovaya-pushka-v-bane': 'reference',
}

const relatedBySlug = {
  'chto-proishodit-s-organizmom-v-bane': ['ventilyatsiya-mobilnoy-bani', 'kak-vybrat-pech-dlya-mobilnoy-bani'],
  'kak-vybrat-drevesinu-dlya-mobilnoy-bani': ['materialy-dlya-mobilnoy-bani', 'pochemu-karkasnaya-banya'],
  'obrabotka-drevesiny-neomid-v-bane': ['uhod-za-mobilnoy-baney', 'fasad-mobilnoy-bani'],
  'materialy-dlya-mobilnoy-bani': ['pirog-steny-mobilnoy-bani', 'uteplenie-isover-ursa-bani'],
  'podgotovka-ploshchadki-pod-mobilnuyu-banyu': ['fundament-dlya-mobilnoy-bani-bloki-ili-svai', 'dostavka-i-ustanovka-mobilnoy-bani'],
  'fundament-dlya-mobilnoy-bani-bloki-ili-svai': ['podgotovka-ploshchadki-pod-mobilnuyu-banyu', 'dostavka-i-ustanovka-mobilnoy-bani'],
  'karkas-ili-brus-dlya-bani': ['pochemu-karkasnaya-banya', 'materialy-dlya-mobilnoy-bani'],
  'pirog-steny-mobilnoy-bani': ['materialy-dlya-mobilnoy-bani', 'ventilyatsiya-mobilnoy-bani'],
  'uteplenie-mobilnoy-bani-dlya-zimy': ['uteplenie-isover-ursa-bani', 'pochemu-ne-ispolzuem-epps-v-polu'],
  'pol-i-sliv-v-bane': ['prolivnoy-pol-v-bane', 'uhod-za-mobilnoy-baney'],
  'ventilyatsiya-mobilnoy-bani': ['pirog-steny-mobilnoy-bani', 'voda-i-boyler-v-mobilnoy-bane'],
  'kak-vybrat-pech-dlya-mobilnoy-bani': ['dymohod-v-derevyannoy-bane', 'otkrytaya-ili-zakrytaya-kamenka', 'parovaya-pushka-v-bane'],
  'dymohod-v-derevyannoy-bane': ['kak-vybrat-pech-dlya-mobilnoy-bani', 'elektrika-v-bane'],
  'elektrika-v-bane': ['voda-i-boyler-v-mobilnoy-bane', 'kak-prinyat-mobilnuyu-banyu'],
  'voda-i-boyler-v-mobilnoy-bane': ['pol-i-sliv-v-bane', 'ventilyatsiya-mobilnoy-bani'],
  'otdelka-parnoy-i-polki': ['obrabotka-drevesiny-neomid-v-bane', 'uhod-za-mobilnoy-baney'],
  'okna-i-dveri-v-bane': ['fasad-mobilnoy-bani', 'materialy-dlya-mobilnoy-bani'],
  'fasad-mobilnoy-bani': ['obrabotka-drevesiny-neomid-v-bane', 'okna-i-dveri-v-bane'],
  'dostavka-i-ustanovka-mobilnoy-bani': ['podgotovka-ploshchadki-pod-mobilnuyu-banyu', 'kak-prinyat-mobilnuyu-banyu'],
  'kak-prinyat-mobilnuyu-banyu': ['dostavka-i-ustanovka-mobilnoy-bani', 'uhod-za-mobilnoy-baney'],
  'uhod-za-mobilnoy-baney': ['otdelka-parnoy-i-polki', 'prolivnoy-pol-v-bane'],
  'pochemu-karkasnaya-banya': ['karkas-ili-brus-dlya-bani', 'materialy-dlya-mobilnoy-bani', 'dostavka-i-ustanovka-mobilnoy-bani'],
  'uteplenie-isover-ursa-bani': ['uteplenie-mobilnoy-bani-dlya-zimy', 'pirog-steny-mobilnoy-bani'],
  'pochemu-ne-ispolzuem-epps-v-polu': ['uteplenie-mobilnoy-bani-dlya-zimy', 'pol-i-sliv-v-bane'],
  'prolivnoy-pol-v-bane': ['pol-i-sliv-v-bane', 'uhod-za-mobilnoy-baney'],
  'otkrytaya-ili-zakrytaya-kamenka': ['kak-vybrat-pech-dlya-mobilnoy-bani', 'kakie-kamni-luchshe-dlya-bani'],
  'kakie-kamni-luchshe-dlya-bani': ['otkrytaya-ili-zakrytaya-kamenka', 'parovaya-pushka-v-bane'],
  'parovaya-pushka-v-bane': ['kak-vybrat-pech-dlya-mobilnoy-bani', 'kakie-kamni-luchshe-dlya-bani'],
}

assert.equal(articlePackage.length, 28, 'Expected 28 source articles')
assert.equal(new Set(articlePackage.map(article => article.slug)).size, 28, 'Source article slugs must be unique')
assert.deepEqual(Object.keys(presentationBySlug).sort(), articlePackage.map(article => article.slug).sort(), 'Every supplied article needs a visual recipe')
assert.deepEqual(Object.keys(relatedBySlug).sort(), articlePackage.map(article => article.slug).sort(), 'Every supplied article needs related links')

const packageSlugs = new Set(articlePackage.map(article => article.slug))
for (const article of articlePackage) {
  assert(article.title && article.description && article.seo_title && article.body_markdown, `${article.slug}: incomplete source fields`)
  const canonicalPath = new URL(article.url, 'https://banger.su').pathname.replace(/\/$/, '')
  assert.equal(canonicalPath, `/poleznoe/${article.slug}`, `${article.slug}: source URL would change`)
  for (const relatedSlug of relatedBySlug[article.slug]) assert(packageSlugs.has(relatedSlug), `${article.slug}: invalid related article ${relatedSlug}`)
}

const coverManifest = new Map(manifest.articles.map(item => [item.slug, item]))
const productionIllustration = manifest.productionIllustration
assert(productionIllustration?.generated === true, 'The production article needs its separate generated illustration')
const productionImagePath = resolvePublicTarget(root, productionIllustration.target)
assert(fs.existsSync(productionImagePath), 'Generated production illustration is missing')
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(productionImagePath)).digest('hex'), productionIllustration.sha256.toLowerCase(), 'Generated production illustration hash differs from the manifest')
const tsSource = ts.createSourceFile(dataPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
let articlesDeclaration
function findArticles(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(tsSource) === 'articles') articlesDeclaration = node
  ts.forEachChild(node, findArticles)
}
findArticles(tsSource)
assert(articlesDeclaration?.initializer && ts.isArrayLiteralExpression(articlesDeclaration.initializer), 'Cannot locate Article[] initializer')
const existingExports = {}
const commonJs = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
vm.runInNewContext(commonJs, { exports: existingExports })
const existing = existingExports.articles
const existingBySlug = new Map(existing.map(article => [article.slug, article]))
assert.equal(existingBySlug.size, 28, 'The current data must contain exactly the 28 unique article routes')
assert.equal(Array.from(existingBySlug.keys()).sort().join('|'), articlePackage.map(article => article.slug).sort().join('|'), 'Source package must match the existing URL set')
assert(existing.length >= existingBySlug.size, 'Article records unexpectedly missing from the current dataset')

const customBody = toArticleHtml(manufacturingMarkdown, 'pochemu-karkasnaya-banya')
const textBySlug = new Map(articlePackage.map(article => [article.slug, article]))
const allSlugs = new Set(existing.map(article => article.slug))
const resourceLinks = [
  { href: '/katalog/bani', label: 'Подобрать баню и комплектацию' },
  { href: '/kontakty#zayavka', label: 'Получить консультацию' },
  { href: '/nashi-raboty', label: 'Посмотреть реализованные проекты' },
]

const refreshed = articlePackage.map(row => {
  const article = existingBySlug.get(row.slug)
  assert(article, `Existing route is missing: ${row.slug}`)
  const isManufacturing = row.slug === 'pochemu-karkasnaya-banya'
  const body = isManufacturing ? customBody : toArticleHtml(row.body_markdown, row.slug)
  const cover = coverManifest.get(row.slug)
  if (isManufacturing) {
    assert(cover && cover.used === false, 'Do not use the wall-section render for the production-process article')
  } else {
    assert(cover && cover.used === true, `${row.slug}: missing approved source image`)
    const outputPath = resolvePublicTarget(root, cover.target)
    assert(fs.existsSync(outputPath), `${row.slug}: copied cover is missing`)
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(outputPath)).digest('hex'), cover.sha256.toLowerCase(), `${row.slug}: copied bytes differ from the source manifest`)
  }
  const imagePath = publicAssetUrl(root, isManufacturing ? productionIllustration.target : cover.target)
  const description = isManufacturing
    ? 'Этапы производства каркасной бани BANGER — от подготовки проекта и пиломатериалов до контроля готового модуля и доставки.'
    : row.description
  const seoTitle = isManufacturing
    ? 'Как устроена каркасная баня BANGER: этапы производства | BANGER.SU'
    : row.seo_title
  return {
    ...article,
    title: isManufacturing ? 'Как устроена каркасная баня BANGER: от производства до готового изделия' : row.title,
    category: isManufacturing ? 'Производство BANGER' : row.category,
    excerpt: description,
    metaDescription: description,
    seoTitle,
    date: article.date,
    updatedAt: '2026-11-26',
    readTime: Math.max(2, Math.ceil(((isManufacturing ? manufacturingMarkdown : row.body_markdown).trim().split(/\s+/).length) / 190)),
    coverImage: imagePath,
    coverAlt: isManufacturing ? productionIllustration.alt : row.alt,
    image: imagePath,
    imageAvif: undefined,
    imageAlt: isManufacturing ? productionIllustration.alt : row.alt,
    imageCaption: isManufacturing ? productionIllustration.caption : `3D-визуализация. ${row.caption}`,
    imageWidth: isManufacturing ? productionIllustration.width : 1600,
    imageHeight: isManufacturing ? productionIllustration.height : 900,
    content: body.content,
    toc: body.toc,
    photoBrief: undefined,
    relatedSlugs: relatedBySlug[row.slug],
    resourceLinks,
    presentation: presentationBySlug[row.slug],
  }
})

assert.equal(refreshed.length, 28)
assert.equal(new Set(refreshed.map(article => article.seoTitle)).size, 28, 'SEO titles must be unique')
assert.equal(new Set(refreshed.map(article => article.metaDescription)).size, 28, 'Meta descriptions must be unique')
assert(refreshed.find(article => article.slug === 'pochemu-karkasnaya-banya').title.startsWith('Как устроена каркасная баня BANGER:'))
assert.equal(refreshed.find(article => article.slug === 'pochemu-karkasnaya-banya').coverImage, publicAssetUrl(root, productionIllustration.target))
for (const article of refreshed) for (const slug of article.relatedSlugs) assert(allSlugs.has(slug), `${article.slug}: invalid related link ${slug}`)

const start = articlesDeclaration.initializer.getStart(tsSource)
const end = articlesDeclaration.initializer.getEnd()
let output = source.slice(0, start) + JSON.stringify(refreshed, null, 2) + source.slice(end)
const legacyImportStart = output.indexOf('// BEGIN OWNER APPROVED EDITORIAL IMPORT 2026-11-16')
const legacyImportEndMarker = '// END OWNER APPROVED EDITORIAL IMPORT 2026-11-16'
const legacyImportEnd = output.indexOf(legacyImportEndMarker)
if (legacyImportStart >= 0) {
  assert(legacyImportEnd > legacyImportStart, 'Cannot safely locate the end of the previous duplicate editorial import block')
  output = output.slice(0, legacyImportStart) + output.slice(legacyImportEnd + legacyImportEndMarker.length)
} else {
  assert(legacyImportEnd < 0, 'Found an unmatched end marker for the previous editorial import')
}
fs.writeFileSync(dataPath, output, 'utf8')
console.log(JSON.stringify({ status: 'PASS', imported: refreshed.length, duplicateRecordsRemoved: existing.length - existingBySlug.size, sourceJsonSha256: crypto.createHash('sha256').update(fs.readFileSync(sourceJson)).digest('hex'), uniqueImages: new Set(refreshed.map(article => article.coverImage).filter(Boolean)).size, generatedProductionIllustration: productionIllustration.target, urlsChanged: 0 }, null, 2))
