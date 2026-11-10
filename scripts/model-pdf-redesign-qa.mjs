import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const sharp = require('sharp')
const cache = new Map()
let captured = []
let measurements = []
const { jsPDF: RealPdf } = require('jspdf')
function CapturingPdf(...args) {
  const doc = new RealPdf(...args), text = doc.text.bind(doc), line = doc.line.bind(doc), horizontalRules = []
  doc.line = (x1, y1, x2, y2, ...rest) => {
    if (y1 === y2) horizontalRules.push({ page: doc.internal.getCurrentPageInfo().pageNumber, x1, x2, y: y1 })
    return line(x1, y1, x2, y2, ...rest)
  }
  doc.text = (value, ...rest) => {
    const page = doc.internal.getCurrentPageInfo().pageNumber
    captured[page - 1] ??= []
    const values = Array.isArray(value) ? value.map(String) : [String(value)]
    captured[page - 1].push(values.join(' '))
    const x = rest[0], options = rest[2]
    if (typeof x === 'number') for (const line of values) {
      const width = doc.getTextWidth(line), align = options?.align
      const left = align === 'right' ? x - width : x, right = align === 'right' ? x : x + width
      const baseline = rest[1]
      const ruleCollision = line === 'Параметры для согласования' && horizontalRules.some(rule => rule.page === page && rule.x2 > left && rule.x1 < right && rule.y > baseline - 2.6 && rule.y < baseline + .4)
      measurements.push({ page, text: line, left, right, ruleCollision })
    }
    return text(value, ...rest)
  }
  return doc
}
function compile(file, sourceOverride) {
  const module = { exports: {} }
  const source = sourceOverride ?? fs.readFileSync(path.join(root, file), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(output, { module, exports: module.exports, require: name => {
    if (name === 'jspdf') return { jsPDF: CapturingPdf }
    if (name === '@/data') return load('src/data/index.ts')
    if (name.startsWith('@/')) return load(`src/${name.slice(2)}.ts`)
    throw new Error(`Unexpected import ${name} from ${file}`)
  }, process, URL, console, Buffer, setTimeout, clearTimeout }, { filename: file })
  return module.exports
}
function load(file) {
  if (!cache.has(file)) cache.set(file, compile(file))
  return cache.get(file)
}
const data = load('src/data/index.ts')
const { calculateModelConfiguration } = load('src/lib/model-configuration-selection.ts')
const { modelOptionAvailability } = load('src/lib/model-option-availability.ts')
const { isLogisticsOption } = load('src/lib/logistics.ts')
const { additionalOptions } = load('src/data/options.ts')
const { optionGuidance } = load('src/data/option-guidance.ts')
const { modelBaseConfiguration, requiresBaseConfigurationConfirmation } = load('src/data/model-configuration.ts')
const { createModelPdf } = load('src/lib/model-pdf.ts')
const previousPdfSource = execFileSync('git', ['show', 'HEAD:src/lib/model-pdf.ts'], { cwd: root, encoding: 'utf8' })
const { createModelPdf: createPreviousModelPdf } = compile('legacy-model-pdf.ts', previousPdfSource)
const model = data.saunas[0]
const availableIds = modelOptionAvailability(model)
  .filter(row => row.status === 'available' || row.status === 'unknown')
  .map(row => row.option.id)
  .filter(id => !isLogisticsOption(id))
assert.ok(availableIds.length >= 12, `${model.id}: expected at least 12 selectable equipment options`)
const font = fs.readFileSync(path.join(root, 'public/fonts/NotoSans-Regular.ttf')).toString('base64')
const qaOutputRoot = process.env.BANGER_QA_OUTPUT_DIR ? path.resolve(process.env.BANGER_QA_OUTPUT_DIR) : null
const outputDir = qaOutputRoot ? path.join(qaOutputRoot, 'pdf') : path.join(root, 'output/pdf')
const renderDir = qaOutputRoot ? path.join(qaOutputRoot, 'pdf-rendered') : path.join(root, 'tmp/pdfs/rendered-2026-11-05')
fs.mkdirSync(outputDir, { recursive: true })
fs.mkdirSync(renderDir, { recursive: true })

const scenarios = [
  { name: '01-base-only', optionIds: [], input: {} },
  { name: '02-one-option', optionIds: [availableIds[0]], input: {} },
  { name: '03-five-options', optionIds: availableIds.slice(0, 5), input: {} },
  { name: '04-twelve-options', optionIds: availableIds.slice(0, 12), input: {} },
  { name: '05-logistics-long-address', optionIds: ['delivery', 'crane-unload'], input: { deliveryDistrict: 'ramenskoe', deliveryAddress: 'Московская область, Раменский муниципальный округ, деревня Синьково, СНТ Сосновый берег, улица Центральная, участок 123, строение 2, ориентир — дорога от перекрёстка у магазина, проезд через северные ворота, выгрузка рядом с хозяйственным въездом.' },
  },
]
const normalize = value => String(value).replace(/[\u00a0\u202f]/g, ' ').replace(/[\u2011-\u2014]/g, '-').replace(/\s+/g, ' ').trim()
const money = value => `${value.toLocaleString('ru-RU')} ₽`
async function loadImagesFor(model, configuration, label) {
  const imagePaths = [...new Set([model.image, model.floorPlan, ...configuration.options.map(option => optionGuidance[option.id]?.image)].filter(Boolean))]
  const images = {}
  for (const imagePath of imagePaths) {
    const file = path.join(root, 'public', decodeURIComponent(imagePath.replace(/^\//, '')))
    assert.ok(fs.existsSync(file), `${label}: missing image ${imagePath}`)
    const { data: image, info } = await sharp(file).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 84 }).toBuffer({ resolveWithObject: true })
    images[imagePath] = { data: `data:image/jpeg;base64,${image.toString('base64')}`, width: info.width, height: info.height }
  }
  return images
}
const results = []
for (const scenario of scenarios) {
  const input = scenario.input
  const configuration = calculateModelConfiguration(model, scenario.optionIds, input)
  const recalculatedTotal = configuration.basePrice + configuration.options.reduce((sum, option) => sum + (option.price ?? 0) * option.quantity, 0) - configuration.discount
  assert.equal(configuration.total, recalculatedTotal, `${scenario.name}: displayed total must equal base + priced options - discount`)
  const images = await loadImagesFor(model, configuration, scenario.name)
  captured = []
  const previousDoc = createPreviousModelPdf(model, configuration, { font, images }, new Date('2026-11-05T09:00:00Z'))
  const previousPageCount = previousDoc.getNumberOfPages()
  captured = []
  measurements = []
  const doc = createModelPdf(model, configuration, { font, images }, new Date('2026-11-05T09:00:00Z'))
  const pdfPath = path.join(outputDir, `${scenario.name}.pdf`)
  fs.writeFileSync(pdfPath, Buffer.from(doc.output('arraybuffer')))
  const pdfInfo = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' })
  const pageCount = Number(pdfInfo.match(/^Pages:\s+(\d+)/m)?.[1])
  assert.ok(Number.isInteger(pageCount) && pageCount === captured.length, `${scenario.name}: PDF page count mismatch (${pageCount} vs ${captured.length})`)
  assert.ok(captured.every(page => page.join(' ').trim().length > 0), `${scenario.name}: blank page detected`)
  assert.ok(measurements.every(line => line.left >= -0.1 && line.right <= 201), `${scenario.name}: text outside printable page bounds: ${JSON.stringify(measurements.find(line => line.left < -0.1 || line.right > 201))}`)
  const allText = normalize(captured.flat().join(' '))
  assert.ok(allText.includes(model.name), `${scenario.name}: model title missing`)
  assert.ok(allText.includes(normalize(money(configuration.basePrice))), `${scenario.name}: base price missing`)
  assert.ok(allText.includes(normalize(money(configuration.total))), `${scenario.name}: final total differs from calculator`)
  for (const row of modelBaseConfiguration(model)) {
    assert.ok(allText.includes(normalize(row.label)), `${scenario.name}: base row label missing (${row.label})`)
    assert.ok(allText.includes(normalize(row.value)), `${scenario.name}: base row value missing (${row.label})`)
    if (requiresBaseConfigurationConfirmation(row.value)) assert.ok(allText.includes('Параметры для согласования'), `${scenario.name}: pending block is not distinguished`)
  }
  for (const option of configuration.options) {
    assert.ok(allText.includes(normalize(option.name)), `${scenario.name}: selected option missing (${option.name})`)
    if (option.price !== null) assert.ok(allText.includes(normalize(money(option.price * option.quantity))), `${scenario.name}: line price missing (${option.name})`)
    if (option.quantity > 1) assert.ok(allText.includes(String(option.quantity)), `${scenario.name}: quantity missing (${option.name})`)
  }
  if (scenario.name === '05-logistics-long-address') {
    assert.equal(configuration.deliveryAddress, scenario.input.deliveryAddress, `${scenario.name}: synthetic address must stay within the UI limit and remain intact`)
    assert.ok(allText.includes(normalize(configuration.deliveryAddress)), `${scenario.name}: full delivery address was truncated`)
    assert.ok(allText.includes('Раменский район'), `${scenario.name}: delivery district missing`)
    assert.equal(configuration.logisticsSubtotal, 45_000)
  }
  const maxPages = scenario.name === '04-twelve-options' ? 3 : 2
  assert.ok(pageCount <= maxPages, `${scenario.name}: expected at most ${maxPages} pages, got ${pageCount}`)
  const prefix = path.join(renderDir, scenario.name)
  execFileSync('pdftoppm', ['-png', '-r', '120', pdfPath, prefix], { stdio: 'ignore' })
  const rendered = Array.from({ length: pageCount }, (_, index) => `${prefix}-${index + 1}.png`)
  for (const page of rendered) assert.ok(fs.existsSync(page) && fs.statSync(page).size > 10_000, `${scenario.name}: rendered page missing or empty`)
  results.push({ scenario: scenario.name, previousPages: previousPageCount, pages: pageCount, reduction: previousPageCount - pageCount, path: pdfPath, bytes: fs.statSync(pdfPath).size, total: configuration.total, optionCount: configuration.options.length, renderedPages: rendered })
}
const allModelPdfResults = []
for (const catalogModel of [...data.saunas, ...data.homes]) {
  const firstConfirmedOption = modelOptionAvailability(catalogModel)
    .find(row => row.status === 'available' && !isLogisticsOption(row.option.id))?.option.id
  const optionIds = firstConfirmedOption ? [firstConfirmedOption] : []
  const configuration = calculateModelConfiguration(catalogModel, optionIds, {})
  const images = await loadImagesFor(catalogModel, configuration, `${catalogModel.id} all-model sweep`)
  captured = []
  measurements = []
  const doc = createModelPdf(catalogModel, configuration, { font, images }, new Date('2026-11-05T09:00:00Z'))
  const bytes = Buffer.from(doc.output('arraybuffer'))
  assert.ok(bytes.length > 10_000, `${catalogModel.id}: generated PDF is unexpectedly small`)
  assert.equal(doc.getNumberOfPages(), captured.length, `${catalogModel.id}: page count and captured page count differ`)
  assert(captured.every(page => page.join(' ').trim().length > 0), `${catalogModel.id}: blank page detected`)
  assert(measurements.every(line => line.left >= -0.1 && line.right <= 201), `${catalogModel.id}: text outside printable bounds`)
  assert(measurements.every(line => !line.ruleCollision), `${catalogModel.id}: table separator crosses the clarification heading`)
  const allText = normalize(captured.flat().join(' '))
  assert(allText.includes(normalize(catalogModel.name)), `${catalogModel.id}: PDF title missing`)
  assert(allText.includes(normalize(money(configuration.basePrice))), `${catalogModel.id}: base price missing`)
  assert(allText.includes(normalize(money(configuration.total))), `${catalogModel.id}: calculator total missing`)
  for (const row of modelBaseConfiguration(catalogModel)) {
    assert(allText.includes(normalize(row.label)), `${catalogModel.id}: base row missing (${row.label})`)
    assert(allText.includes(normalize(row.value)), `${catalogModel.id}: base row value missing (${row.label})`)
  }
  for (const spec of catalogModel.specs) {
    assert(allText.includes(normalize(spec.label)), `${catalogModel.id}: model spec missing (${spec.label})`)
    assert(allText.includes(normalize(spec.value)), `${catalogModel.id}: model spec value missing (${spec.label})`)
  }
  if (firstConfirmedOption) {
    const selected = configuration.options.find(option => option.id === firstConfirmedOption)
    assert(selected && allText.includes(normalize(selected.name)), `${catalogModel.id}: selected option not represented in PDF`)
  }
  allModelPdfResults.push({ id: catalogModel.id, name: catalogModel.name, pageCount: doc.getNumberOfPages(), firstConfirmedOption: firstConfirmedOption ?? null, bytes: bytes.length })
}
const report = { status: 'PASS', model: model.name, modelId: model.id, font: 'Noto Sans', scenarios: results, allModelSweep: { total: allModelPdfResults.length, saunas: data.saunas.length, homes: data.homes.length, results: allModelPdfResults } }
fs.writeFileSync(path.join(renderDir, 'qa-results.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
