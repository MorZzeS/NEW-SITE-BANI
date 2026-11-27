import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const Module = require('node:module')
const originalResolve = Module._resolveFilename
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/')) request = path.join(root, 'src', request.slice(2))
  return originalResolve.call(this, request, parent, isMain, options)
}
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
  module._compile(output, filename)
}

const { calculateModelConfiguration, configurationManagerText } = require(path.join(root, 'src/lib/model-configuration-selection.ts'))
const { toggleEquipmentOption } = require(path.join(root, 'src/lib/equipment-selection.ts'))
const { approvedColorVariantsFor } = require(path.join(root, 'src/data/catalog-color-variants.ts'))
const { additionalOptions } = require(path.join(root, 'src/data/options.ts'))
const exteriorIds = ['exterior-imitation-board', 'exterior-blockhouse', 'exterior-profile-sheet']
const finishRows = additionalOptions.filter(option => exteriorIds.includes(option.id))
assert.equal(finishRows.length, 3, 'Only the three approved finish variants should exist')
assert.deepEqual(finishRows.map(option => [option.id, option.name, option.salePrice]), [
  ['exterior-imitation-board', 'Имитация бруса — базовый вариант', 0],
  ['exterior-blockhouse', 'Наружная отделка блок-хаусом', 35000],
  ['exterior-profile-sheet', 'Наружная отделка профлистом', 60000],
])

const sauna = { id: 'bg-13', slug: 'skandinaviya-test', name: 'Скандинавия — тест', series: 'Скандинавия', priceFrom: 500000, specs: [], features: [], size: '7,5 × 2,4 м', area: 18 }
const standard = calculateModelConfiguration(sauna, [])
assert.equal(standard.total, 500000, 'Standard finish must add zero rubles')
assert.deepEqual(standard.selectedOptionIds, ['exterior-imitation-board'])
assert.equal(calculateModelConfiguration(sauna, ['exterior-blockhouse']).total, 535000)
assert.equal(calculateModelConfiguration(sauna, ['exterior-profile-sheet']).total, 560000)
assert.equal(calculateModelConfiguration(sauna, ['exterior-blockhouse', 'exterior-profile-sheet']).total, 560000, 'Selecting a second finish must replace, not add, the first')
const ral = additionalOptions.find(option => option.id === 'facade-ral')
assert.equal(ral?.salePrice, 25000, 'The owner-approved RAL price is 25,000 RUB')
assert.equal(calculateModelConfiguration(sauna, ['facade-ral']).total, 525000, 'RAL may be combined with the default imitation-board finish')
assert.equal(calculateModelConfiguration(sauna, ['exterior-blockhouse', 'facade-ral']).total, 560000, 'RAL may be combined with blockhouse')
assert.equal(calculateModelConfiguration(sauna, ['facade-ral', 'exterior-profile-sheet']).total, 560000, 'Selecting profile sheet removes incompatible RAL')
assert.equal(calculateModelConfiguration(sauna, ['exterior-profile-sheet', 'facade-ral']).total, 525000, 'Selecting RAL removes profile sheet and restores the zero-price default finish')
assert.deepEqual(toggleEquipmentOption(['facade-ral'], 'exterior-profile-sheet'), ['exterior-profile-sheet'])
assert.deepEqual(toggleEquipmentOption(['exterior-profile-sheet'], 'facade-ral'), ['facade-ral'])
assert.match(ral.description, /профлистом несовместима/u)
const blockhouse = calculateModelConfiguration(sauna, ['exterior-blockhouse'])
assert.match(configurationManagerText(blockhouse), /Наружная отделка блок-хаусом.*35\s?000/u)
const barn = calculateModelConfiguration({ ...sauna, slug: 'barn-premium' }, [])
assert.equal(barn.selectedOptionIds.some(id => exteriorIds.includes(id)), false, 'Barn Premium remains outside the calculator finish options')
const home = calculateModelConfiguration({ id: 'home-test', slug: 'home-test', name: 'Дом — тест', priceFrom: 500000, specs: [], features: [], size: '6 × 2,4 м', area: 14.4 }, ['exterior-profile-sheet'])
assert.equal(home.total, 500000, 'Bath exterior finishes must not be offered on houses')

const source = fs.readFileSync(path.join(root, 'src/data/index.ts'), 'utf8')
const sourceFile = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
function initializer(name) {
  let result = null
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === name) result = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  assert(result, `Missing ${name} data`)
  return vm.runInNewContext(`(${result.getText(sourceFile)})`)
}
const activeModels = [...initializer('saunas'), ...initializer('homes')].filter(model => model.isPublished !== false)
const migration = fs.readFileSync(path.join(root, 'backend/spaceweb/migrations/20261127_model_views.sql'), 'utf8')
const seededIds = [...migration.matchAll(/\('(bg-\d{2})', 0\)/gu)].map(match => match[1])
assert.deepEqual([...seededIds].sort(), activeModels.map(model => model.id).sort(), 'The counter migration must seed exactly all published models')
assert.equal(new Set(seededIds).size, seededIds.length, 'Model counter seed IDs must be unique')
for (const config of ['config.production.example.php', 'config.test.example.php']) {
  const contents = fs.readFileSync(path.join(root, 'backend/spaceweb/private', config), 'utf8')
  assert.match(contents, /'model_views_enabled'\s*=>\s*false/u)
  assert.match(contents, /'model_views_approved'\s*=>\s*false/u)
  assert.match(contents, /'model_views_https_proxy_verified'\s*=>\s*false/u)
}
const htaccess = fs.readFileSync(path.join(root, 'backend/spaceweb/public_html/.htaccess'), 'utf8')
assert.match(htaccess, /FilesMatch\s+"\^\(\?!leads\\\.php\$\|model-views\\\.php\$\)/u, 'Only the existing leads endpoint and the new counter endpoint are admitted')
assert.match(htaccess, /RewriteRule \^model-views\\\.php\$ - \[L\]/u)
const validation = fs.readFileSync(path.join(root, 'backend/spaceweb/private/validation.php'), 'utf8')
for (const id of exteriorIds) assert(validation.includes(`'${id}'`), `Server validator must allowlist ${id}`)
assert.match(validation, /\$selectedExteriorFinishes>1/u, 'Server rejects more than one finish')
assert.match(validation, /\$ralOption=\['name'=>'Окраска внешней отделки по RAL','price'=>25000\]/u)
assert.match(validation, /in_array\('facade-ral',\$ids,true\)\s*&&\s*in_array\('exterior-profile-sheet',\$ids,true\)/u, 'Server rejects the incompatible RAL + profile-sheet pair')
const counterEndpoint = fs.readFileSync(path.join(root, 'backend/spaceweb/public_html/model-views.php'), 'utf8')
assert.match(counterEndpoint, /\$c\['model_views_enabled'\]\s*\?\?\s*false\) !== true/u)
assert.match(counterEndpoint, /\$c\['model_views_approved'\]\s*\?\?\s*false\) !== true/u)
assert.match(counterEndpoint, /\$c\['model_views_https_proxy_verified'\]\s*\?\?\s*false\) !== true/u)
assert.match(counterEndpoint, /const MODEL_VIEW_ALLOWED_IDS = \[/u)
assert.match(counterEndpoint, /const MODEL_VIEW_MAX_BODY_BYTES = 512/u)
assert.match(counterEndpoint, /UPDATE model_view_counts SET views = views \+ 1 WHERE model_id = \?/u, 'Counter increments atomically in MySQL')
assert.match(counterEndpoint, /\$modelId = modelViewsRequestId\(\)/u)
assert(counterEndpoint.indexOf('modelViewsRequestId()') < counterEndpoint.indexOf('operationDb($c)'), 'POST payload validation must precede DB connection')
assert.match(counterEndpoint, /HTTP_ORIGIN/u)
assert.match(counterEndpoint, /HTTP_SEC_FETCH_SITE/u)
assert(!/REMOTE_ADDR|HTTP_USER_AGENT|HTTP_REFERER|HTTP_COOKIE|X_FORWARDED_FOR|visitorToken|analyticsConsent|HMAC|daily_dedup|localStorage|cookie|phone|email|lead_id/iu.test(counterEndpoint), 'Counter endpoint must not read or store visitor/contact identifiers')
const counterClient = fs.readFileSync(path.join(root, 'src/lib/model-view-counter.ts'), 'utf8')
assert(!/localStorage|sessionStorage|document\.cookie|visitorToken|analyticsConsent|readAnalyticsConsent|crypto\.getRandomValues/iu.test(counterClient), 'Counter client must not identify a visitor')
assert.match(counterClient, /referrerPolicy: 'no-referrer'/u)
assert.match(fs.readFileSync(path.join(root, 'src/components/catalog/ModelViewCount.tsx'), 'utf8'), /<span>Просмотров<\/span>/u)
const backupFormat = fs.readFileSync(path.join(root, 'backend/spaceweb/private/backup-format.php'), 'utf8')
const backupWorker = fs.readFileSync(path.join(root, 'backend/spaceweb/bin/backup.php'), 'utf8')
const retentionWorker = fs.readFileSync(path.join(root, 'backend/spaceweb/bin/retention.php'), 'utf8')
assert.match(backupFormat, /'model_view_counts'/u)
assert.match(backupWorker, /SELECT \* FROM model_view_counts/u)
assert(!/model_view_daily_dedup|viewer_hash|updated_at/u.test(migration), 'Counter table stores only model ID and total count')
assert.match(backupFormat, /'model_view_counts'=>\['model_id','views'\]/u)
assert(!/model_view_daily_dedup/u.test(retentionWorker), 'Counter requires no per-view retention job')
assert.match(fs.readFileSync(path.join(root, 'backend/spaceweb/tests/backup-format.php'), 'utf8'), /'model_id'=>'bg-09','views'=>'42'/u)

const renderManifestPath = path.join(root, 'docs/editorial-assets/2026-11-27/catalog-color-render-manifest.json')
const renderManifest = JSON.parse(fs.readFileSync(renderManifestPath, 'utf8'))
assert.equal(renderManifest.variantCount, 84)
assert.deepEqual(renderManifest.missingModelCodes, [])
const renderRegistrySource = fs.readFileSync(path.join(root, 'src/data/catalog-color-variants.ts'), 'utf8')
const registryFile = ts.createSourceFile('catalog-color-variants.ts', renderRegistrySource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
let registryInitializer
const visitRegistry = node => {
  if (ts.isVariableDeclaration(node) && node.name.getText(registryFile) === 'catalogColorVariants') registryInitializer = node.initializer
  ts.forEachChild(node, visitRegistry)
}
visitRegistry(registryFile)
assert(registryInitializer, 'Color render registry must exist')
const registry = vm.runInNewContext(`(${registryInitializer.getText(registryFile)})`)
assert.equal(registry.length, 84)
assert(registry.every(item => item.reviewStatus === 'owner-approved'), 'All supplied color renders have owner approval')
const publishedSaunas = initializer('saunas').filter(model => model.isPublished !== false)
assert.equal(publishedSaunas.length, 14)
const publishedModelIds = [...publishedSaunas].map(model => model.id).sort()
assert.deepEqual([...new Set(registry.map(item => item.modelId))].sort(), publishedModelIds, 'Every published sauna must have supplied color variants')
assert.deepEqual(renderManifest.models, publishedModelIds)
for (const model of publishedSaunas) {
  const variants = registry.filter(item => item.modelId === model.id)
  assert.equal(variants.length, 6, model.id + ' must have six owner-supplied colors')
  assert.deepEqual([...variants].map(item => item.colorCode).sort(), ['01', '02', '03', '04', '05', '06'])
  assert(variants.every(item => item.modelSlug === model.slug && item.modelName === model.name), model.id + ' registry identity must match catalog model')
  for (const variant of variants) assert.equal(variant.src, '/images/catalog/color-variants/' + model.id + '/' + variant.colorCode + '.webp', model.id + ' color code must map to its matching image asset')
  assert.equal(approvedColorVariantsFor(model.id).length, 6, model.id + ' selector must expose six variants')
}
assert.equal(renderManifest.supplementalSources.at(-1).variantCount, 24)
assert.deepEqual(renderManifest.supplementalSources.at(-1).modelIds, ['bg-09', 'bg-10', 'bg-11', 'bg-12'])
for (const item of registry) {
  const assetPath = path.join(root, 'public', item.src.replace(/^\//u, ''))
  assert(fs.existsSync(assetPath), `Color image missing: ${item.src}`)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(assetPath)).digest('hex'), item.webpSha256, `Color asset changed: ${item.src}`)
}
assert.match(fs.readFileSync(path.join(root, 'src/components/catalog/CatalogCardGallery.tsx'), 'utf8'), /approvedColorVariantsFor/u, 'Owner-approved supplied colors must be selectable')
assert(!/Рендеры на проверке|ожидает сверки конструкции|кандидат рендера для проверки/u.test(fs.readFileSync(path.join(root, 'src/components/catalog/CatalogCardGallery.tsx'), 'utf8')))

console.log(JSON.stringify({ status: 'PASS', finishCalculations: '500000 / 525000 / 535000 / 560000 RUB', finishExclusivity: 'PASS', ralCompatibleWithImitationAndBlockhouse: true, ralRejectedWithProfileSheet: true, barnExcluded: true, houseExcluded: true, modelCountersSeeded: seededIds.length, convertedColorRenders: registry.length, colorModelsWithSixVariants: publishedSaunas.length, missingColorModels: renderManifest.missingModelCodes, colorRendersOwnerApproved: true, modelCounterStorage: 'model_id + views only' }, null, 2))
