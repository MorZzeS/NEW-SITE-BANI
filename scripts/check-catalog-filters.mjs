import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const sourcePath = path.resolve('src/lib/catalog-filters.ts')
const source = fs.readFileSync(sourcePath, 'utf8')
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const exports = {}
vm.runInNewContext(code, { exports, module: { exports }, Math, Number }, { filename: sourcePath })

const { longestDimensionInMeters } = exports
assert.equal(longestDimensionInMeters('4,5 × 7 м'), 7, 'classify a rectangular home by its longest side')
assert.equal(longestDimensionInMeters('4.5 x 6 m'), 6, 'accept decimal points and ASCII x')
assert.equal(longestDimensionInMeters('6 м'), 6, 'accept single-dimensional model sizes')
assert.equal(longestDimensionInMeters('размер не указан'), 0, 'unknown dimensions must not match a size range')

console.log('PASS: longest-side catalogue size filters, decimal separators, single dimensions and unknown values')
