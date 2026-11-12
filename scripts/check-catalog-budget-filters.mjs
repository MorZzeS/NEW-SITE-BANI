import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function load(relative) {
  const exports = {}
  const source = fs.readFileSync(path.join(root, relative), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  vm.runInNewContext(code, { exports, Number, Math }, { filename: relative })
  return exports
}

const { saunas, homes } = load('src/data/index.ts')
const { filterByBudget, sortByPrice } = load('src/lib/catalog-filters.ts')
const thresholds = [575_000, 750_000, 850_000, 1_000_000, 1_200_000, 1_500_000]
const saunaCounts = [10, 21, 22, 23, 24, 25]
const homeCounts = [0, 0, 0, 0, 0, 4]

for (const [products, expectedCounts, kind] of [[saunas, saunaCounts, 'saunas'], [homes, homeCounts, 'homes']]) {
  for (const [index, limit] of thresholds.entries()) {
    assert.equal(filterByBudget(products, 0, limit).length, expectedCounts[index], `${kind}: inclusive upper budget ${limit}`)
    const matching = products.filter(product => product.priceFrom <= limit)
    assert.deepEqual(
      Array.from(filterByBudget(products, '', limit), product => product.id),
      Array.from(matching, product => product.id),
      `${kind}: upper-only budget preserves catalogue order before sorting`,
    )
  }

  for (const product of products) {
    const exact = filterByBudget(products, product.priceFrom, product.priceFrom)
    assert.deepEqual(Array.from(exact, item => item.id), Array.from(products).filter(item => item.priceFrom === product.priceFrom).map(item => item.id), `${kind}/${product.id}: both boundaries are inclusive`)
    assert.equal(filterByBudget(products, product.priceFrom + 1, product.priceFrom).length, 0, `${kind}/${product.id}: inverted bounds return no false match`)
  }

  assert.deepEqual(Array.from(filterByBudget(products, 0, ''), item => item.id), Array.from(products, item => item.id), `${kind}: cleared budget resets to all models`)
  assert.deepEqual(Array.from(sortByPrice(products, 'asc'), item => item.priceFrom), Array.from(products, item => item.priceFrom).sort((a, b) => a - b), `${kind}: ascending price sort`)
  assert.deepEqual(Array.from(sortByPrice(products, 'desc'), item => item.priceFrom), Array.from(products, item => item.priceFrom).sort((a, b) => b - a), `${kind}: descending price sort`)

  const combined = sortByPrice(filterByBudget(products, 575_000, 1_200_000), 'asc')
  assert.ok(combined.every(item => item.priceFrom >= 575_000 && item.priceFrom <= 1_200_000), `${kind}: budget and sort compose without escaping bounds`)
  assert.deepEqual(Array.from(combined, item => item.priceFrom), Array.from(combined, item => item.priceFrom).sort((a, b) => a - b), `${kind}: combined filter is sorted`)
}

assert.deepEqual(Array.from(saunas, model => model.priceFrom), Array.from(load('src/data/index.ts').saunas, model => model.priceFrom), 'filter/sort utilities must not mutate source model arrays')
console.log(JSON.stringify({ status: 'PASS', models: { saunas: saunas.length, homes: homes.length }, thresholds, counts: { saunas: saunaCounts, homes: homeCounts }, boundaries: 'inclusive', reset: 'all models restored', sort: 'ascending and descending', combinations: 'budget + sort' }, null, 2))
