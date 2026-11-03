import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// This audit verifies cumulative price changes against the fixed pre-increase baseline.
// Saunas received +40,000 ₽ on 27 Oct and a further +15,000 ₽ on 3 Nov; homes retain +40,000 ₽.
// It only reads prices: running it cannot apply an increase.
export const PRICE_BASELINE = '0e18849ddb891cae04d596babf8537cedd453cfe'
export const MODEL_INCREASE = 55000
export const HOME_MODEL_INCREASE = 40000
export const ADDITIONAL_SAUNA_INCREASE = 15000
export const OPTION_INCREASE = 5000
export const OPTION_PRICE_PROVENANCE = '; повышение владельца от 27.10.2026: +5 000 ₽ к цене на 0e18849'
const scriptPath = fileURLToPath(import.meta.url)
const defaultRoot = path.resolve(path.dirname(scriptPath), '..')
const plain = value => JSON.parse(JSON.stringify(value))
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const rubles = value => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const variantAmount = value => Number(value?.match(/: ([\d \u00a0\u202f]+) ₽$/u)?.[1].replace(/\s/g, ''))

function loadData(source) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { exports })
  return plain(exports)
}

export function increasedVariant(variant, increase = MODEL_INCREASE) {
  // The colon anchors the price so dimensions such as "Каркас 150 мм" stay intact.
  const match = variant.match(/^(.*: )([\d \u00a0\u202f]+)( ₽)$/u)
  if (!match) throw new Error(`Unrecognised variant price: ${variant}`)
  return match[1] + rubles(Number(match[2].replace(/\s/g, '')) + increase) + match[3]
}

export function auditPriceUpdate(root = defaultRoot) {
  const errors = []
  const check = (condition, message) => { if (!condition) errors.push(message) }
  const sourceFiles = ['src/data/index.ts', 'src/data/options.ts']
  const baselineText = Object.fromEntries(sourceFiles.map(file => [file, execFileSync('git', ['show', `${PRICE_BASELINE}:${file}`], { cwd: root, encoding: 'utf8' })]))
  const currentText = Object.fromEntries(sourceFiles.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]))
  const oldData = loadData(baselineText[sourceFiles[0]])
  const newData = loadData(currentText[sourceFiles[0]])
  const oldOptions = loadData(baselineText[sourceFiles[1]])
  const newOptions = loadData(currentText[sourceFiles[1]])
  const beforeModels = [...oldData.saunas, ...oldData.homes]
  const afterModels = [...newData.saunas, ...newData.homes]
  check(oldData.saunas.length === 25 && oldData.homes.length === 6, 'Baseline must contain 25 saunas / 6 homes')
  check(newData.saunas.length === 25 && newData.homes.length === 6, 'Current catalog must contain 25 saunas / 6 homes')
  check(new Set(afterModels.map(m => m.id)).size === 31, 'Current model IDs must be unique 31/31')
  check(equal(beforeModels.map(m => m.id), afterModels.map(m => m.id)), 'Model IDs/order changed')
  const models = beforeModels.map(before => {
    const after = afterModels.find(model => model.id === before.id)
    const category = oldData.saunas.some(m => m.id === before.id) ? 'sauna' : 'home'
    const expectedIncrease = category === 'sauna' ? MODEL_INCREASE : HOME_MODEL_INCREASE
    const expectedVariants = (before.priceVariants ?? []).map(variant => increasedVariant(variant, expectedIncrease))
    const expected = { ...before, priceFrom: before.priceFrom + expectedIncrease }
    if (before.priceVariants) expected.priceVariants = expectedVariants
    check(equal(after, expected), `${before.id}: model differs from its authorised cumulative increase or nonprice data changed`)
    return { id: before.id, name: before.name, category, expectedIncrease, baselinePrice: before.priceFrom, expectedPrice: expected.priceFrom, currentPrice: after?.priceFrom, delta: after?.priceFrom - before.priceFrom,
      variants: (before.priceVariants ?? []).map((variant, index) => ({ baseline: variant, expected: expectedVariants[index], current: after?.priceVariants?.[index], baselinePrice: variantAmount(variant), currentPrice: variantAmount(after?.priceVariants?.[index]), delta: variantAmount(after?.priceVariants?.[index]) - variantAmount(variant), expectedIncrease })) }
  })
  const restoreModels = (data, originals) => {
    for (const collection of ['saunas', 'homes']) data[collection] = data[collection].map(model => {
      const original = originals.find(item => item.id === model.id)
      if (!original) return model
      const restored = { ...model, priceFrom: original.priceFrom }
      if (original.priceVariants) restored.priceVariants = original.priceVariants
      return restored
    })
    return data
  }
  const restoredData = restoreModels(plain(newData), beforeModels)
  // A subsequent explicit owner correction changes only the public email.
  if (restoredData.siteSettings.email !== oldData.siteSettings.email) {
    check(restoredData.siteSettings.email === 'banger.ram@bk.ru', 'Unapproved public email change')
    restoredData.siteSettings.email = oldData.siteSettings.email
  }
  check(equal(restoredData, oldData), 'Other catalog exports or nonprice data changed')
  check(equal(newOptions.optionCategories, oldOptions.optionCategories), 'Option categories changed')
  check(equal(newOptions.additionalOptions.map(o => o.id), oldOptions.additionalOptions.map(o => o.id)), 'Option IDs/order changed')
  const options = oldOptions.additionalOptions.map(before => {
    const after = newOptions.additionalOptions.find(option => option.id === before.id)
    const paid = typeof before.salePrice === 'number' && before.salePrice > 0 && before.source !== 'unconfirmed'
    const expected = { ...before }
    if (paid) {
      expected.salePrice += OPTION_INCREASE
      expected.priceSource = `Исходная цена: ${before.priceSource}${OPTION_PRICE_PROVENANCE}`
    }
    check(equal(after, expected), `${before.id}: option differs from authorised increase or nonprice data changed`)
    return { id: before.id, name: before.name, unit: before.priceUnit, paid, baselinePrice: before.salePrice, expectedPrice: expected.salePrice, currentPrice: after?.salePrice, delta: paid ? after?.salePrice - before.salePrice : null, baselinePriceSource: before.priceSource, currentPriceSource: after?.priceSource }
  })
  check(options.filter(o => o.paid).length === 18, 'Expected exactly 18 confirmed paid options')
  check(options.filter(o => !o.paid).length === 1 && options.find(o => o.id === 'tray')?.currentPrice === null, 'Unconfirmed tray must remain unpriced')
  // A text-level comparison also catches edits to helpers/comments outside data.
  const normalise = source => source.replaceAll('\r\n', '\n')
  const scrubModels = source => normalise(source).replace("email: 'banger.ram@bk.ru'", "email: 'banger.su@bk.ru'").replace(/priceFrom: \d+/g, 'priceFrom: PRICE').replace(/priceVariants: \[[^\]]*\]/g, 'priceVariants: VARIANTS')
  const scrubOptions = source => normalise(source).replace(/"salePrice": (?:\d+|null)/g, '"salePrice": PRICE').replace(/"priceSource": "[^"]*"/g, '"priceSource": SOURCE')
  check(scrubModels(currentText[sourceFiles[0]]) === scrubModels(baselineText[sourceFiles[0]]), 'Catalog source changed outside price literals')
  check(scrubOptions(currentText[sourceFiles[1]]) === scrubOptions(baselineText[sourceFiles[1]]), 'Option source changed outside prices/provenance')
  return { status: errors.length ? 'FAIL' : 'PASS', baseline: PRICE_BASELINE, modelIncrease: MODEL_INCREASE, homeModelIncrease: HOME_MODEL_INCREASE, additionalSaunaIncrease: ADDITIONAL_SAUNA_INCREASE, optionIncrease: OPTION_INCREASE, counts: { saunas: newData.saunas.length, homes: newData.homes.length, models: models.length, alternativePrices: models.reduce((n, m) => n + m.variants.length, 0), paidOptions: options.filter(o => o.paid).length, unpricedOptions: options.filter(o => !o.paid).length }, sourceFiles, errors, models, options }
}

export function writePriceReport(report, directory) {
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'pricing-audit.json'), JSON.stringify(report, null, 2) + '\n')
  const lines = [`# Изменение цен по состоянию на 03.11.2026 — ${report.status}`, '', `База: \`${report.baseline}\`. Мобильные бани: +55 000 ₽ суммарно от базы (+40 000 ₽ ранее и ещё +15 000 ₽ 03.11.2026); дома: +40 000 ₽; подтверждённые платные опции: +5 000 ₽. Повторный аудит не меняет цены.`, '', '| Модель / исполнение | До, ₽ | После, ₽ | Изменение, ₽ | Проверка |', '| --- | ---: | ---: | ---: | --- |']
  for (const model of report.models) {
    const status = model.currentPrice === model.expectedPrice && model.delta === model.expectedIncrease && !report.errors.some(error => error.startsWith(`${model.id}:`)) ? 'PASS' : 'FAIL'
    lines.push(`| ${model.id} — ${model.name} | ${rubles(model.baselinePrice)} | ${rubles(model.currentPrice)} | ${rubles(model.delta)} | ${status} |`)
    for (const variant of model.variants) {
      const variantStatus = variant.current === variant.expected && variant.delta === variant.expectedIncrease ? 'PASS' : 'FAIL'
      lines.push(`| ↳ ${variant.baseline.split(': ')[0]} | ${rubles(variant.baselinePrice)} | ${rubles(variant.currentPrice)} | ${rubles(variant.delta)} | ${variantStatus} |`)
    }
  }
  lines.push('', '| Опция | Единица | До, ₽ | После, ₽ | Изменение, ₽ | Проверка |', '| --- | --- | ---: | ---: | ---: | --- |')
  for (const option of report.options) {
    const passed = option.currentPrice === option.expectedPrice && (!option.paid || option.delta === OPTION_INCREASE) && !report.errors.some(error => error.startsWith(`${option.id}:`))
    const status = passed ? option.paid ? 'PASS' : 'Без изменения / PASS' : 'FAIL'
    lines.push(`| ${option.id} — ${option.name} | ${option.unit} | ${option.baselinePrice === null ? 'по согласованию' : rubles(option.baselinePrice)} | ${option.currentPrice === null ? 'по согласованию' : rubles(option.currentPrice)} | ${option.paid ? rubles(option.delta) : 'без изменений'} | ${status} |`)
  }
  lines.push('', 'Изменения непрайсовых полей проверены сравнением с фиксированной базой. Исторические ссылки на PPT сохранены как источники исходных цен; повышение отдельно атрибутировано владельцу. Данные каталога и платных опций проверены целиком; сборка, браузер и публикация этим аудитом не проверяются.', '')
  if (report.errors.length) lines.push('Ошибки:', ...report.errors.map(error => `- ${error}`), '')
  fs.writeFileSync(path.join(directory, 'pricing-comparison.md'), lines.join('\n'))
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const report = auditPriceUpdate()
  const reportArg = process.argv.indexOf('--report-dir')
  if (reportArg !== -1) {
    if (!process.argv[reportArg + 1]) throw new Error('--report-dir requires a directory')
    writePriceReport(report, path.resolve(process.argv[reportArg + 1]))
  }
  console.log(JSON.stringify({ status: report.status, baseline: report.baseline, counts: report.counts, errors: report.errors }, null, 2))
  if (report.errors.length) process.exitCode = 1
}
