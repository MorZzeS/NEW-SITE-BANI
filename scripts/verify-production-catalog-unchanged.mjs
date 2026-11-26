import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Article-only test releases must preserve the exact catalog and option data
// from the currently published production revision. This replaces a historic
// price audit whose baseline predates several approved catalog updates.
export const PRODUCTION_BASELINE = '2a23ae0ba64f48904f05bb183cb02e1584be24e0'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = ['src/data/index.ts', 'src/data/options.ts']
const fail = message => { throw new Error(message) }
const readGit = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' })
const loadModule = source => {
  const exports = {}
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  vm.runInNewContext(js, { exports })
  return JSON.parse(JSON.stringify(exports))
}
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right)

try {
  readGit(['merge-base', '--is-ancestor', PRODUCTION_BASELINE, 'HEAD'])
} catch {
  fail(`Production baseline ${PRODUCTION_BASELINE} is not an ancestor of HEAD`)
}

const baseline = Object.fromEntries(files.map(file => [file, loadModule(readGit(['show', `${PRODUCTION_BASELINE}:${file}`]))]))
const current = Object.fromEntries(files.map(file => [file, loadModule(fs.readFileSync(path.join(root, file), 'utf8'))]))

for (const collection of ['saunas', 'homes']) {
  const before = baseline[files[0]][collection]
  const after = current[files[0]][collection]
  if (!Array.isArray(before) || !Array.isArray(after)) fail(`${collection} must be an exported array`)
  if (!equal(after, before)) fail(`${collection} changed from production baseline ${PRODUCTION_BASELINE}`)
  if (new Set(after.map(model => model.id)).size !== after.length) fail(`${collection} contains duplicate model IDs`)
}

if (!equal(current[files[1]], baseline[files[1]])) {
  fail(`src/data/options.ts changed from production baseline ${PRODUCTION_BASELINE}`)
}

console.log(`PASS: sauna/home model records and options exactly match production ${PRODUCTION_BASELINE}`)
