import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'
const load = source => {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports })
  return exports
}
const read = path => load(fs.readFileSync(path, 'utf8'))
const catalog = read('src/data/index.ts')
const baseline = load(execFileSync('git', ['show', 'HEAD:src/data/index.ts'], { encoding: 'utf8' }))
const { sortByLength, longestDimensionInMeters, filterByBudget } = read('src/lib/catalog-filters.ts')
for (const kind of ['saunas', 'homes']) {
  assert.equal(catalog[kind].length, baseline[kind].length)
  for (const product of catalog[kind]) {
    const old = baseline[kind].find(item => item.id === product.id)
    const { name, executionFeatures, ...preserved } = product
    const { name: oldName, ...previous } = old
    if (product.id === 'bg-20') {
      // Owner-approved public specification: these execution features are already included
      // in the model's existing price and must never be added again by the calculator.
      for (const field of ['subtitle', 'description']) {
        delete preserved[field]
        delete previous[field]
      }
      assert.equal(JSON.stringify(preserved), JSON.stringify(previous), `${product.id}: identity, price and unapproved data preserved`)
      assert.equal(product.priceFrom, old.priceFrom, `${product.id}: approved price unchanged`)
      assert.equal(product.priceVariants, old.priceVariants, `${product.id}: no alternative price introduced`)
      assert.equal(product.name, oldName, `${product.id}: public model name preserved`)
      assert.equal(JSON.stringify(product.features), JSON.stringify([
        'Скрытая электрика и подсветка',
        'Ламинация окон и двери',
        'Тропический душ и бойлер 50 л',
        'Санузел и декоративные рейки',
      ]), 'catalogue features used by calculator remain unchanged')
      assert.equal(JSON.stringify(executionFeatures), JSON.stringify([
        'Санузел',
        'Проливные полы в парной и помывочной',
        'Панорамное окно',
        'Декоративные наружные рейки под окнами и над дверью',
        'Дополнительные наружные светильники',
        'Индивидуальная планировка',
        'Увеличение высоты на 20 см',
        'Покраска по RAL',
        'Полы из лиственницы в парной и помывочной',
      ]))
    } else {
      assert.equal(JSON.stringify(preserved), JSON.stringify(previous), `${product.id}: all non-name data preserved`)
      assert.equal(executionFeatures, undefined, `${product.id}: no unapproved included-options list`)
    }
    assert.equal(name, oldName.replace(/^Скандинавия (Комфорт|Терра|Панорама|Резиденс) /, 'Скандинавия '))
  }
  const source = catalog[kind].filter(item => item.isPublished !== false)
  for (const list of [source, filterByBudget(source, 600000, 800000), source.filter(item => item.hasShower), []]) {
    const before = JSON.stringify(list)
    const sorted = sortByLength(list)
    assert.equal(JSON.stringify(list), before, 'sorting does not mutate source/filter results')
    for (let i = 1; i < sorted.length; i++) {
      const previous = longestDimensionInMeters(sorted[i - 1].size)
      const current = longestDimensionInMeters(sorted[i].size)
      assert(previous <= current)
      if (previous === current) assert(sorted[i - 1].id.localeCompare(sorted[i].id, 'ru', { numeric: true }) <= 0)
    }
    assert.equal(JSON.stringify(sorted), JSON.stringify(sortByLength([...list].reverse())), 'tie order independent of input')
  }
}
assert.equal(longestDimensionInMeters('4,5 × 2,4 м'), 4.5)
assert.equal(longestDimensionInMeters('7,5 × 2,4 м'), 7.5)
const individual = catalog.publishedSaunas.find(item => item.id === 'bg-20')
assert.equal(individual.priceFrom, 1039100)
assert.equal(individual.name, 'Скандинавия 7 С-Д')
assert(catalog.publishedSaunas.some(item => item.id !== individual.id && item.name === individual.name))
console.log('PASS: model identity, URLs, images, plans, features and prices preserved; renamed public labels; numeric length sorting, stable ties and filtered subsets; bg-20 remains a separate published model at 1 039 100 ₽.')
