import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// This audit verifies cumulative price changes against the fixed pre-increase baseline.
// All 31 models received +40,000 ₽ earlier and a further +15,000 ₽ on 3 Nov.
// It only reads prices: running it cannot apply an increase.
export const PRICE_BASELINE = '0e18849ddb891cae04d596babf8537cedd453cfe'
export const OPTION_BASELINE = '51720e3d4bf63757b13fc1c7c1e81d4667e25736'
export const MODEL_INCREASE = 55000
export const HOME_MODEL_INCREASE = 40000
export const ADDITIONAL_SAUNA_INCREASE = 15000
export const OPTION_INCREASE = 0
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
  const baselineText = Object.fromEntries(sourceFiles.map(file => [file, execFileSync('git', ['show', `${file === 'src/data/options.ts' ? OPTION_BASELINE : PRICE_BASELINE}:${file}`], { cwd: root, encoding: 'utf8' })]))
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
  check(equal(newOptions.optionCategories, [...oldOptions.optionCategories, 'Логистика']), 'Option categories changed outside the approved logistics category')
  const owner20261109 = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/approved-options-20261109.json'), 'utf8'))
  const owner20261110 = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/approved-options-20261110.json'), 'utf8'))
  const approvedOverride = id => {
    const prior = owner20261109.overrides.find(option => option.id === id)
    const latest = owner20261110.overrides.find(option => option.id === id)
    return prior || latest ? { ...(prior || {}), ...(latest || {}) } : undefined
  }
  const approvedNewOptions = [
    { id: 'facade-ral', name: 'Окраска внешней отделки по RAL', salePrice: 25000, category: 'Внешний вид', priceUnit: 'опция', description: 'Окраска наружной отделки в выбранный оттенок RAL; цвет и материалы согласуются при заказе.', enabled: true, source: 'owner-2026-11-03', priceSource: 'Стоимость 25 000 ₽ утверждена владельцем 03.11.2026.' },
    { id: 'ceiling-height', name: 'Увеличение высоты потолка', salePrice: 22000, category: 'Общее по бане', priceUnit: '10 см', description: 'Увеличение на 10 см — 22 000 ₽, на 20 см — 44 000 ₽; максимум 20 см. Итоговая высота и техническая возможность согласуются при заказе.', enabled: true, source: 'owner-2026-11-03', priceSource: '22 000 ₽ за каждые 10 см — указано владельцем 03.11.2026.' },
    { id: 'outdoor-lighting', name: 'Уличное освещение', salePrice: 15000, category: 'Электрика и освещение', priceUnit: 'опция', description: 'Наружное освещение для бани со стандартной открытой проводкой, без перехода на скрытую электрику.', enabled: true, source: 'owner-2026-11-03', priceSource: '15 000 ₽ — указано владельцем 03.11.2026. Не дублирует пакет со скрытой электрикой.' },
    { id: 'larch-wash', name: 'Пол из лиственницы в моечной', salePrice: null, category: 'Моечная', priceUnit: 'опция', description: 'Замена чистового пола в моечной на лиственницу. Стоимость и конструкция требуют подтверждения.', enabled: true, source: 'owner-mention-2026-11-03', priceSource: 'Опция упомянута владельцем 03.11.2026, цену не сообщал.' },
    { id: 'delivery', name: 'Доставка — Раменский район', salePrice: 20000, category: 'Логистика', description: 'Стоимость доставки в пределах Раменского района составляет 20 000 ₽. Доставка в другие районы и населённые пункты рассчитывается индивидуально.', priceUnit: 'услуга', enabled: true, source: 'owner-2026-11-03', priceSource: '20 000 ₽ только при явно выбранном Раменском районе. Иначе — индивидуальный расчёт.' },
    { id: 'crane-unload', name: 'Разгрузка краном — Раменский район', salePrice: 25000, category: 'Логистика', description: 'Стоимость разгрузки краном в пределах Раменского района составляет 25 000 ₽. За пределами района стоимость рассчитывается индивидуально.', priceUnit: 'услуга', enabled: true, source: 'owner-2026-11-03', priceSource: '25 000 ₽ только при явно выбранном Раменском районе. Иначе — индивидуальный расчёт.' },
    { id: 'wooden-window-600', name: 'Деревянное окно 600 × 600 мм', salePrice: 7000, category: 'Окна и двери', description: 'Деревянное окно размером 600 × 600 мм. Возможность установки и размеры проёма подтверждаются для выбранной модели.', priceUnit: 'шт.', enabled: true, source: 'owner-2026-11-03', priceSource: '7 000 ₽ — уточнение владельца 03.11.2026.' },
    { id: 'wooden-window-400', name: 'Деревянное окно 400 × 400 мм', salePrice: 5500, category: 'Окна и двери', description: 'Деревянное окно размером 400 × 400 мм. Возможность установки и размеры проёма подтверждаются для выбранной модели.', priceUnit: 'шт.', enabled: true, source: 'owner-2026-11-03', priceSource: '5 500 ₽ — уточнение владельца 03.11.2026.' },
    { id: 'replanning', image: '/images/options/guidance/replanning.svg', name: 'Перепланировка стандартного проекта', salePrice: 10000, category: 'Общее по бане', priceUnit: 'услуга', description: 'Изменение стандартной планировки бани по пожеланиям заказчика. Дополнительные материалы и сложные конструктивные изменения рассчитываются отдельно', enabled: true, source: 'owner-2026-11-09', priceSource: '10 000 ₽ — утверждено владельцем 09.11.2026.' },
  ]
  for (let index = 0; index < approvedNewOptions.length; index++) approvedNewOptions[index] = approvedOverride(approvedNewOptions[index].id) || approvedNewOptions[index]
  approvedNewOptions.push(...owner20261109.additions)
  const baselineIds = oldOptions.additionalOptions.map(o => o.id)
  check(equal(newOptions.additionalOptions.map(o => o.id), [...baselineIds, ...approvedNewOptions.map(o => o.id)]), 'Option IDs/order changed outside the exact owner-approved additions')
  const options = oldOptions.additionalOptions.map(before => {
    const after = newOptions.additionalOptions.find(option => option.id === before.id)
    const paid = typeof before.salePrice === 'number' && before.salePrice > 0 && before.source !== 'unconfirmed'
    const expected = { ...before }
    if (before.id === 'furniture') {
      expected.name = 'Дополнительная заводская мебель'
      expected.description = 'Мебель сверх подарочного набора (стол и две лавки). Состав, размеры и установка согласуются для выбранной модели.'
    }
    if (before.id === 'tray') {
      expected.name = 'Душевой поддон со шторкой и выводом воды'
      expected.salePrice = 18000
      expected.description = 'Включает поддон, шторку и вывод воды. Размещение и совместимость согласуются для выбранной модели.'
      expected.source = 'owner-2026-11-03'
      expected.priceSource = '18 000 ₽ за поддон со шторкой и выводом воды — уточнение владельца 03.11.2026.'
    }
    const override = approvedOverride(before.id)
    if (override) Object.assign(expected, override)
    check(equal(after, expected), `${before.id}: baseline option changed outside the exact owner-approved overrides`)
    return { id: before.id, name: before.name, unit: before.priceUnit, paid, baselinePrice: before.salePrice, expectedPrice: expected.salePrice, currentPrice: after?.salePrice, delta: paid ? after?.salePrice - before.salePrice : null, baselinePriceSource: before.priceSource, currentPriceSource: after?.priceSource }
  })
  check(options.filter(o => o.paid).length === 18, 'Historical baseline must contain 18 confirmed paid options')
  for (const expected of approvedNewOptions) {
    const actual = newOptions.additionalOptions.find(option => option.id === expected.id)
    check(equal(actual, expected), `${expected.id}: new option differs from its exact approved definition`)
    options.push({ id: expected.id, name: expected.name, unit: expected.priceUnit, paid: expected.salePrice !== null, baselinePrice: null, expectedPrice: expected.salePrice, currentPrice: actual?.salePrice, delta: null, baselinePriceSource: null, currentPriceSource: actual?.priceSource })
  }
  check(newOptions.additionalOptions.filter(o => typeof o.salePrice === 'number' && o.salePrice > 0).length === 38, 'Expected exactly 38 positive confirmed priced options')
  check(equal(newOptions.additionalOptions.filter(o => o.salePrice === null).map(o => o.id), ['ermak', 'larch-wash', 'ermak-16-ps', 'ermak-16-premium-steel', 'ermak-16-premium-cast-iron']), 'Only the unconfirmed larch floor and four individually calculated stove replacement supplements may be unpriced')
  for (const [id, price] of Object.entries({ led: 12000, 'steam-bench-oil': 15000 })) {
    const option = newOptions.additionalOptions.find(o => o.id === id)
    check(option?.salePrice === price && option.enabled === true && !('proposedRetailPrice' in option) && !('priceStatus' in option), `${id}: final owner-approved price must be selectable, without preliminary status`)
  }
  for (const [id, retail] of Object.entries({ ermak: 17000, 'ermak-16-ps': 25000, 'ermak-16-premium-steel': 45000, 'ermak-16-premium-cast-iron': 66000 })) {
    const option = newOptions.additionalOptions.find(o => o.id === id)
    check(option?.salePrice === null && option.confirmedRetailPrice === retail && option.priceStatus === 'replacement-pending' && !('proposedRetailPrice' in option), `${id}: approved full retail must not be charged as a replacement supplement`)
  }
  check(newOptions.additionalOptions.find(o => o.id === 'tray')?.salePrice === 18000, 'Curtained shower tray must use the approved 18 000 RUB price')
  // The catalog model comparison is structural; prices and approved contact email are the only allowed source changes.
  const normalise = source => source.replaceAll('\r\n', '\n')
  const scrubModels = source => normalise(source).replace("email: 'banger.ram@bk.ru'", "email: 'banger.su@bk.ru'").replace(/priceFrom: \d+/g, 'priceFrom: PRICE').replace(/priceVariants: \[[^\]]*\]/g, 'priceVariants: VARIANTS')
  check(scrubModels(currentText[sourceFiles[0]]) === scrubModels(baselineText[sourceFiles[0]]), 'Catalog source changed outside price literals')
  return { status: errors.length ? 'FAIL' : 'PASS', baseline: PRICE_BASELINE, modelIncrease: MODEL_INCREASE, homeModelIncrease: HOME_MODEL_INCREASE, additionalSaunaIncrease: ADDITIONAL_SAUNA_INCREASE, optionIncrease: OPTION_INCREASE, counts: { saunas: newData.saunas.length, homes: newData.homes.length, models: models.length, alternativePrices: models.reduce((n, m) => n + m.variants.length, 0), paidOptions: newOptions.additionalOptions.filter(o => typeof o.salePrice === 'number' && o.salePrice > 0).length, unpricedOptions: newOptions.additionalOptions.filter(o => o.salePrice === null).length }, sourceFiles, errors, models, options }
}

export function writePriceReport(report, directory) {
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'pricing-audit.json'), JSON.stringify(report, null, 2) + '\n')
  const lines = [`# Изменение цен по состоянию на 03.11.2026 — ${report.status}`, '', `База моделей: \`${report.baseline}\`. 25 бань: +55 000 ₽ суммарно (+40 000 ₽ ранее и ещё +15 000 ₽ 03.11.2026); 6 домов: +40 000 ₽ без изменения. Исторические цены опций сверяются с \`${OPTION_BASELINE}\`; проверены восемь точных добавлений/уточнений. Повторный аудит не меняет цены.`, '', '| Модель / исполнение | До, ₽ | После, ₽ | Изменение, ₽ | Проверка |', '| --- | ---: | ---: | ---: | --- |']
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
    const passed = option.currentPrice === option.expectedPrice && !report.errors.some(error => error.startsWith(`${option.id}:`))
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
