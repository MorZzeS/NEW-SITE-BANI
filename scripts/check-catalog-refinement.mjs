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
const approvedPrices = new Map([
  ['bg-09', 575000], ['bg-10', 607000], ['bg-11', 640000], ['bg-12', 646000],
  ['bg-13', 672000], ['bg-14', 646000], ['bg-15', 731000], ['bg-16', 640000],
  ['bg-17', 698000], ['bg-18', 619000], ['bg-19', 752000], ['bg-20', 825000],
  ['bg-21', 876000], ['bg-28', 1435000],
])
const { sortByLength, longestDimensionInMeters, filterByBudget } = read('src/lib/catalog-filters.ts')
for (const kind of ['saunas', 'homes']) {
  assert.equal(catalog[kind].length, baseline[kind].length)
  for (const product of catalog[kind]) {
    const old = baseline[kind].find(item => item.id === product.id)
    const { name, executionFeatures, priceFrom, ...preserved } = product
    const { name: oldName, priceFrom: oldPrice, ...previous } = old
    assert.equal(priceFrom, approvedPrices.get(product.id) ?? oldPrice, `${product.id}: only the owner-approved price may differ`)
    if (product.id === 'bg-20') {
      // Owner clarified that 825 000 ₽ is the base price; previous execution upgrades are separate options.
      delete previous.executionFeatures
      for (const field of ['subtitle', 'description', 'features', 'specs']) {
        delete preserved[field]
        delete previous[field]
      }
      delete preserved.priceFrom
      delete previous.priceFrom
      assert.equal(JSON.stringify(preserved), JSON.stringify(previous), `${product.id}: identity and unapproved nonprice data preserved`)
      assert.equal(product.priceVariants, old.priceVariants, `${product.id}: no alternative price introduced`)
      assert.equal(product.name, oldName, `${product.id}: public model name preserved`)
      assert.equal(JSON.stringify(product.features), JSON.stringify(['Планировка С-Д по проекту']))
      assert.equal(executionFeatures, undefined, 'previous non-base execution must no longer be presented as included')
      assert.match(product.subtitle, /Базовая комплектация/u)
      assert.match(product.description, /дополнительные опции.*добавляются к стоимости/u)
      assert.equal(product.specs.find(row => row.label === 'Исполнение')?.value, 'Базовая комплектация')
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
assert.equal(individual.priceFrom, 825000)
assert.equal(individual.name, 'Скандинавия 7 С-Д')
assert(catalog.publishedSaunas.some(item => item.id !== individual.id && item.name === individual.name))
console.log('PASS: model identity, URLs, images, plans and features preserved; owner-approved card prices applied; renamed public labels; numeric length sorting, stable ties and filtered subsets; bg-20 remains a separate published model at 825 000 ₽.')
