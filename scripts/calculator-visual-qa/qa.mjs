import fs from 'node:fs'
import path from 'node:path'
import { Cdp, browserWs, writeBase64, sleep } from './cdp.mjs'

const baseUrl = process.argv[2]
const outDir = path.resolve(process.argv[3])
const port = Number(process.argv[4] || 9333)
const matrix = JSON.parse(fs.readFileSync('docs/model-option-compatibility.json', 'utf8'))
fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true })
fs.mkdirSync(path.join(outDir, 'pdfs'), { recursive: true })

const results = { startedAt: new Date().toISOString(), baseUrl, pages: [], errors: [], pdfs: [], screenshots: [], form: {}, summary: {} }
const browser = await browserWs(port)
const cdp = new Cdp(browser.webSocketDebuggerUrl)
await cdp.connect()
const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
await cdp.attachPage(targetId)
await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable'); await cdp.send('Network.enable')
let currentErrors = []
cdp.on('Runtime.exceptionThrown', params => currentErrors.push({ kind: 'exception', text: params.exceptionDetails?.text || params.exceptionDetails?.exception?.description || 'exception' }))
cdp.on('Log.entryAdded', params => { if (params.entry.level === 'error') currentErrors.push({ kind: 'log', text: params.entry.text }) })
cdp.on('Runtime.consoleAPICalled', params => { if (params.type === 'error') currentErrors.push({ kind: 'console', text: (params.args || []).map(arg => arg.value ?? arg.description ?? '').join(' ') }) })
cdp.on('Network.loadingFailed', params => { if (!params.canceled && !String(params.errorText).includes('ERR_ABORTED')) currentErrors.push({ kind: 'network', text: `${params.errorText} ${params.type}` }) })
cdp.on('Network.responseReceived', params => { if (params.response.status >= 400) currentErrors.push({ kind: 'http', text: `${params.response.status} ${params.response.url}` }) })

const evaluate = async expression => {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (exceptionDetails) throw new Error(exceptionDetails.text || exceptionDetails.exception?.description || 'evaluate failed')
  return result.value
}
const setViewport = (width, height) => cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
const setTheme = theme => cdp.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-color-scheme', value: theme }] })
const navigate = async url => {
  const load = cdp.waitForLoad()
  await cdp.send('Page.navigate', { url })
  await load
  await sleep(700)
}
const screenshot = async file => { const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); writeBase64(file, data) }

const state = () => evaluate(`(() => {
  const calc = document.querySelector('[data-model-option-calculator]');
  const total = document.querySelector('[data-estimated-total]');
  const rows = [...document.querySelectorAll('[data-option-id]')];
  const availableRows = rows.filter(row => row.dataset.optionSelectable === 'true');
  const checkboxCount = document.querySelectorAll('[data-option-selectable="true"] input[type="checkbox"]').length;
  const optionsGroup = document.querySelector('[class*="optionGroups"]');
  const summary = document.querySelector('[class*="summary"]');
  return {
    modelId: calc?.dataset.modelOptionCalculator || null,
    base: Number(calc?.dataset.basePrice || 0),
    discount: Number(calc?.dataset.discount || 0),
    promotion: calc?.dataset.promotion || '',
    domAvailable: Number(calc?.dataset.availableCount || 0),
    domIncluded: Number(calc?.dataset.includedCount || 0),
    domUnknown: Number(calc?.dataset.unknownCount || 0),
    rows: rows.length,
    availableRows: availableRows.length,
    includedRows: rows.filter(row => row.dataset.optionStatus === 'included').length,
    unknownRows: rows.filter(row => row.dataset.optionStatus === 'unknown').length,
    availableIds: availableRows.map(row => row.dataset.optionId),
    availablePrices: Object.fromEntries(availableRows.map(row => [row.dataset.optionId, Number(row.dataset.optionPrice || 0)])),
    checkboxCount,
    selected: Number(total?.dataset.selectedCount || 0),
    known: Number(total?.dataset.knownOptionsTotal || 0),
    total: Number(total?.dataset.estimatedTotal || 0),
    selectedIds: total?.dataset.selectedOptionIds || '',
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0 && img.getAttribute('src')).map(img => img.getAttribute('src')).slice(0, 5),
    mobileOrderOK: optionsGroup && summary ? summary.getBoundingClientRect().top > optionsGroup.getBoundingClientRect().top : null,
    pdfButton: Boolean(document.querySelector('[data-model-pdf-button]')),
    resetButton: Boolean(document.querySelector('[data-calculator-reset]')),
    form: (() => {
      const form = document.querySelector('form');
      if (!form) return { form: false };
      const labels = [...form.querySelectorAll('label')].map(label => label.textContent.trim().slice(0, 80));
      const links = [...form.querySelectorAll('a')].map(link => link.getAttribute('href'));
      return { form: true, labels, links, heading: form.closest('section')?.querySelector('h2')?.textContent || '' };
    })(),
  };
})()`)

const clickIndex = async index => evaluate(`document.querySelectorAll('[data-option-selectable="true"] input[type="checkbox"]')[${index}]?.click()`)
const clickId = async id => evaluate(`document.querySelector('[data-option-id="${id}"] input[type="checkbox"]')?.click()`)

const failures = []
const check = (condition, message) => { if (!condition) failures.push(message) }

for (const model of matrix.models) {
  currentErrors = []
  await setViewport(1440, 1000)
  await setTheme('dark')
  await navigate(baseUrl + model.route)
  const desktop = await state()
  check(desktop.modelId === model.id, `${model.id}: calculator data-model mismatch (${desktop.modelId})`)
  check(desktop.rows === 19, `${model.id}: expected 19 option rows, got ${desktop.rows}`)
  check(desktop.domAvailable === model.counts.available, `${model.id}: available count ${desktop.domAvailable} != matrix ${model.counts.available}`)
  check(desktop.domIncluded === model.counts.included, `${model.id}: included count ${desktop.domIncluded} != matrix ${model.counts.included}`)
  check(desktop.domUnknown === model.counts.unknown, `${model.id}: unknown count ${desktop.domUnknown} != matrix ${model.counts.unknown}`)
  check(desktop.availableRows === model.counts.available && desktop.checkboxCount === model.counts.available, `${model.id}: selectable checkboxes ${desktop.checkboxCount}/${desktop.availableRows} != available ${model.counts.available}`)
  check(desktop.scrollWidth <= desktop.innerWidth + 1, `${model.id}: horizontal overflow at 1440 (${desktop.scrollWidth} > ${desktop.innerWidth})`)
  check(desktop.brokenImages.length === 0, `${model.id}: broken images ${desktop.brokenImages.join(',')}`)
  check(desktop.pdfButton, `${model.id}: PDF button missing`)
  check(desktop.resetButton, `${model.id}: reset button missing`)

  for (let index = 0; index < desktop.availableRows; index++) { await clickIndex(index); await sleep(12) }
  const selectedAll = await state()
  const expectedSum = Object.values(desktop.availablePrices).reduce((sum, price) => sum + price, 0)
  const ids = selectedAll.selectedIds ? selectedAll.selectedIds.split(',') : []
  check(selectedAll.selected === desktop.availableRows, `${model.id}: selected ${selectedAll.selected} != available ${desktop.availableRows}`)
  check(new Set(ids).size === ids.length, `${model.id}: duplicate selected ids`)
  check(selectedAll.known === expectedSum, `${model.id}: options sum ${selectedAll.known} != expected ${expectedSum}`)
  check(selectedAll.total === desktop.base + expectedSum - desktop.discount, `${model.id}: total ${selectedAll.total} != base ${desktop.base} + options ${expectedSum} - discount ${desktop.discount}`)
  check((selectedAll.known === 0) === (desktop.availableRows === 0), `${model.id}: zero-option model must keep zero options total`)
  if (desktop.availableRows > 0) {
    await clickIndex(0); await sleep(40)
    const removed = await state()
    const removedPrice = desktop.availablePrices[desktop.availableIds[0]] || 0
    check(removed.selected === desktop.availableRows - 1, `${model.id}: remove did not decrement selection`)
    check(removed.total === desktop.base + expectedSum - removedPrice - desktop.discount, `${model.id}: total after removal is wrong`)
  }
  await evaluate(`document.querySelector('[data-calculator-reset]')?.click()`); await sleep(60)
  const reset = await state()
  check(reset.selected === 0, `${model.id}: reset did not clear selection`)
  check(reset.total === desktop.base - desktop.discount, `${model.id}: reset total ${reset.total} != base ${desktop.base}`)

  await setViewport(390, 844); await sleep(300)
  const mobile = await state()
  check(mobile.scrollWidth <= mobile.innerWidth + 1, `${model.id}: horizontal overflow at 390 (${mobile.scrollWidth} > ${mobile.innerWidth})`)
  check(mobile.mobileOrderOK === true, `${model.id}: mobile order must put options before summary (${mobile.mobileOrderOK})`)
  await setViewport(1440, 1000)

  const variants=[]
  for (const width of [1440,768,390]) for (const theme of ['light','dark']) {
    await setViewport(width,1000); await setTheme(theme); await sleep(100)
    const variant=await state(); variants.push({width,theme,...variant})
    check(variant.scrollWidth<=width+1, model.id+': overflow '+width+' '+theme)
    if(width<=1000)check(variant.mobileOrderOK===true, model.id+': summary order '+width+' '+theme)
  }
  await setViewport(1440, 1000)
  const pageErrors = currentErrors.slice()
  if (pageErrors.length) failures.push(`${model.id}: browser errors ${JSON.stringify(pageErrors.slice(0, 3))}`)
  results.pages.push({ id: model.id, route: model.route, name: model.name, counts: model.counts, desktop, mobile, variants, errors: pageErrors })
}

// Promotional 15 000 offer is applied only for baths opened from the exit-intent source.
await setViewport(1440, 1000); await setTheme('dark')
await navigate(`${baseUrl}/banya/istok-4`)
const plain = await state()
await navigate(`${baseUrl}/banya/istok-4?source=exit-intent`)
const promo = await state()
const promoFirst = await clickId('boiler').then(() => sleep(80)).then(() => state())
check(promo.promotion === 'exit-intent', 'promo page: promotion flag missing')
check(promo.discount === 15000 && promo.total === promo.base - 15000, `promo page: discount/total wrong (${promo.discount}/${promo.total})`)
check(promoFirst.total === promo.base + (promo.availablePrices.boiler || 0) - 15000, 'promo page: total with one option is wrong')
check(plain.discount === 0, 'regular model page must not apply the promo silently')
await navigate(`${baseUrl}/dom/usadba-praktik`)
const homePromoCheck = await evaluate(`(async () => { const calc = document.querySelector('[data-model-option-calculator]'); return { discount: Number(calc?.dataset.discount || 0), available: Number(calc?.dataset.availableCount || 0), unknown: Number(calc?.dataset.unknownCount || 0) } })()`)
check(homePromoCheck.discount === 0 && homePromoCheck.available === 0 && homePromoCheck.unknown === 19, 'planless home: matrix must be unknown-only without discount')
results.promo = { plain: { discount: plain.discount, total: plain.total, base: plain.base }, promo: { discount: promo.discount, total: promo.total, base: promo.base }, promoWithOption: { total: promoFirst.total }, planlessHome: homePromoCheck }

// PDF: base document, one option and several options.
const downloadDir = path.join(outDir, 'downloads')
fs.mkdirSync(downloadDir, { recursive: true })
await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir, eventsEnabled: true })
const pdfCases = [
  { id: 'bg-01', file: 'istok-4-base.pdf', options: [] },
  { id: 'bg-04', file: 'istok-6-one-option.pdf', options: ['shower'] },
  { id: 'bg-19', file: 'sever-terra-6-5-multi.pdf', options: ['shade', 'bench-light', 'led', 'decor', 'guard'] },
]
for (const testCase of pdfCases) {
  const model = matrix.models.find(item => item.id === testCase.id)
  currentErrors = []
  await navigate(baseUrl + model.route)
  for (const optionId of testCase.options) { await clickId(optionId); await sleep(50) }
  const before = await state()
  for (const file of fs.readdirSync(downloadDir)) fs.rmSync(path.join(downloadDir, file), { force: true })
  await evaluate(`document.querySelector('[data-model-pdf-button]')?.click()`)
  let file = null
  const startedPdf = Date.now()
  while (Date.now() - startedPdf < 120000) {
    const files = fs.readdirSync(downloadDir).filter(name => name.endsWith('.pdf'))
    if (files.length) { file = path.join(downloadDir, files[0]); break }
    await sleep(500)
  }
  check(Boolean(file), `${testCase.id}: PDF download failed`)
  if (file) {
    const target = path.join(outDir, 'pdfs', testCase.file)
    fs.copyFileSync(file, target)
    results.pdfs.push({ id: testCase.id, file: path.relative(process.cwd(), target), selected: before.selected, known: before.known, total: before.total, base: before.base, options: testCase.options, bytes: fs.statSync(target).size, errors: currentErrors.slice() })
    if (currentErrors.length) failures.push(`${testCase.id}: PDF browser errors ${JSON.stringify(currentErrors.slice(0, 3))}`)
  }
}

// Screenshots: three models, 1440/390, DAY/NIGHT, with a representative selection.
const settleVisual = async (selector, offset = 76) => {
  await evaluate(`(async () => {
    const continueButton = [...document.querySelectorAll('button,a')].find(node => /Продолжить без дополнительных настроек|Принять все|Только необходимые/.test(node.textContent || ''));
    continueButton?.click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.race([
      Promise.all([...document.images].filter(image => image.complete).slice(0, 30).map(image => image.decode ? image.decode().catch(() => {}) : Promise.resolve())),
      new Promise(resolve => setTimeout(resolve, 2500)),
    ]);
    const target = document.querySelector('${selector}');
    if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - ${offset});
    await new Promise(resolve => setTimeout(resolve, 250));
    const again = document.querySelector('${selector}');
    if (again) window.scrollTo(0, again.getBoundingClientRect().top + window.scrollY - ${offset});
  })()`)
  await sleep(500)
}
const screenshotCases = [
  { id: 'bg-01', options: ['boiler', 'decor'] },
  { id: 'bg-13', options: ['shower', 'led', 'window-grid'] },
  { id: 'bg-21', options: ['shade', 'guard', 'wall-point'] },
  { id: 'bg-28', options: [] },
  { id: 'bg-25', options: [] },
]
for (const testCase of screenshotCases) {
  const model = matrix.models.find(item => item.id === testCase.id)
  await setViewport(1440, 1000)
  await navigate(baseUrl + model.route)
  for (const optionId of testCase.options) { await clickId(optionId); await sleep(50) }
  for (const theme of ['light', 'dark']) {
    await setTheme(theme); await sleep(250)
    await settleVisual('[data-model-option-calculator]')
    const desktopFile = path.join(outDir, 'screenshots', `${testCase.id}-1440-${theme}.png`)
    await screenshot(desktopFile)
    results.screenshots.push(path.relative(process.cwd(), desktopFile))
    await setViewport(390, 844); await sleep(250)
    await settleVisual('[data-model-option-calculator]')
    const mobileFile = path.join(outDir, 'screenshots', `${testCase.id}-390-${theme}.png`)
    await screenshot(mobileFile)
    results.screenshots.push(path.relative(process.cwd(), mobileFile))
    if (testCase.id === 'bg-01') {
      await settleVisual('[data-model-option-calculator] [class*="summary"]', 40)
      const summaryFile = path.join(outDir, 'screenshots', `${testCase.id}-390-summary-${theme}.png`)
      await screenshot(summaryFile)
      results.screenshots.push(path.relative(process.cwd(), summaryFile))
    }
    await setViewport(1440, 1000); await sleep(150)
  }
}

// Form UI on the enabled build (submit is intentionally blocked on plain HTTP; live HTTPS is verified separately).
await setViewport(1440, 1000); await setTheme('dark')
await navigate(`${baseUrl}/banya/istok-4`)
await settleVisual('section[data-release-profile="online-leads"]')
const formDesktop = await state()
await screenshot(path.join(outDir, 'screenshots', 'form-1440-dark.png'))
await setViewport(390, 844); await sleep(300)
await settleVisual('section[data-release-profile="online-leads"]', 40)
const formMobile = await state()
await screenshot(path.join(outDir, 'screenshots', 'form-390-dark.png'))
await setViewport(1440, 1000); await sleep(200)
results.form = { desktop: formDesktop.form, mobile: formMobile.form }
check(formDesktop.form.form === true, 'lead form is not rendered in the enabled build')
check((formDesktop.form.heading || '').includes('Свяжитесь с нами'), 'lead form heading mismatch')
for (const expected of ['Имя', 'Телефон', 'Модель', 'Комментарий', 'Согласие']) check(formDesktop.form.labels.some(label => label.includes(expected)), `lead form field missing: ${expected}`)
check((formDesktop.form.links || []).some(link => link.includes('/soglasie-pd')) && (formDesktop.form.links || []).some(link => link.includes('/politika')), 'lead form consent links missing')

results.errors = failures
results.summary = { pages: results.pages.length, failures: failures.length, pdfs: results.pdfs.length, screenshots: results.screenshots.length }
results.finishedAt = new Date().toISOString()
fs.writeFileSync(path.join(outDir, 'qa-results.json'), JSON.stringify(results, null, 1))
console.log(JSON.stringify(results.summary, null, 1))
if (failures.length) { console.log('FAILURES:'); for (const failure of failures.slice(0, 40)) console.log(' - ' + failure) }
cdp.close()
process.exit(failures.length ? 1 : 0)
