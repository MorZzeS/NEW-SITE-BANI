import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Test releases may add owner-approved options/content and the exact model
// prices in the owner's 27 Nov 2026 card-price sheet. Other model prices and
// all existing option prices remain anchored to the production revision.
export const PRODUCTION_BASELINE = '2a23ae0ba64f48904f05bb183cb02e1584be24e0'
export const APPROVED_MODEL_PRICES = new Map([
  ['bg-09', 575000], ['bg-10', 607000], ['bg-11', 640000], ['bg-12', 646000],
  ['bg-13', 672000], ['bg-14', 646000], ['bg-15', 731000], ['bg-16', 640000],
  ['bg-17', 698000], ['bg-18', 619000], ['bg-19', 752000], ['bg-20', 825000],
  ['bg-21', 876000], ['bg-28', 1435000],
])

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
  const beforeById = new Map(before.map(model => [model.id, model]))
  for (const model of after) {
    const previous = beforeById.get(model.id)
    if (!previous) fail(`${collection} added model ${model.id} beyond production baseline ${PRODUCTION_BASELINE}`)
    const approvedPrice = APPROVED_MODEL_PRICES.get(model.id)
    if (model.slug !== previous.slug) fail(`${model.id}: route identity changed from production baseline`)
    if (approvedPrice === undefined && model.priceFrom !== previous.priceFrom) fail(`${model.id}: unapproved base price changed from production baseline`)
    if (approvedPrice !== undefined && model.priceFrom !== approvedPrice) fail(`${model.id}: card price must match the owner's approved ${approvedPrice} RUB`)
  }
  if (after.length !== before.length) fail(`${collection} model count changed from production baseline ${PRODUCTION_BASELINE}`)
  if (new Set(after.map(model => model.id)).size !== after.length) fail(`${collection} contains duplicate model IDs`)
}

const beforeOptions = new Map(baseline[files[1]].additionalOptions.map(option => [option.id, option]))
const currentOptions = new Map(current[files[1]].additionalOptions.map(option => [option.id, option]))
for (const [id, option] of beforeOptions) {
  const updated = currentOptions.get(id)
  if (!updated) fail(`Existing option ${id} was removed`)
  if (option.salePrice !== updated.salePrice) fail(`Existing option ${id} price changed from production baseline`)
}
const approvedNewFinishes = new Map([
  ['exterior-imitation-board', 0],
  ['exterior-blockhouse', 35000],
  ['exterior-profile-sheet', 60000],
])
for (const [id, price] of approvedNewFinishes) {
  if (currentOptions.get(id)?.salePrice !== price) fail(`Approved exterior finish ${id} must cost ${price} RUB`)
}
for (const id of currentOptions.keys()) {
  if (!beforeOptions.has(id) && !approvedNewFinishes.has(id)) fail(`Unapproved new option ${id}`)
}
const ral = currentOptions.get('facade-ral')
if (!ral?.description.includes('С профлистом несовместима')) fail('RAL finish must remain incompatible with profile sheet')

for (const modelId of APPROVED_MODEL_PRICES.keys()) {
  if (!current[files[0]].saunas.some(model => model.id === modelId && model.isPublished)) fail(`Approved price model ${modelId} must exist as a published sauna`)
}

console.log(`PASS: sauna/home route identities; ${APPROVED_MODEL_PRICES.size} exact owner-approved prices; other base prices; existing option prices; 3 approved exterior finishes; RAL incompatibility (${PRODUCTION_BASELINE})`)
