import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const index = fs.readFileSync(path.join(root, 'src/data/index.ts'), 'utf8')
const sources = JSON.parse(fs.readFileSync(path.join(root, 'src/data/model-room-area-sources.json'), 'utf8'))
const ids = [...index.matchAll(/\bid:\s*['"](bg-\d{2})['"]/g)].map(match => match[1])
const errors = []

if (ids.length !== 31 || new Set(ids).size !== 31) errors.push(`Expected 31 unique catalog models, found ${ids.length}.`)
for (const id of ids) {
  const source = sources[id]
  if (!source) { errors.push(`${id}: source review is missing.`); continue }
  if (!['explicit-room-areas', 'plan-without-room-areas', 'plan-unavailable'].includes(source.status)) errors.push(`${id}: invalid review status.`)
  const line = index.split(/\r?\n/).find(value => value.includes(`id: "${id}"`) || value.includes(`id: '${id}'`)) ?? ''
  const planMatch = line.match(/floorPlan:\s*['"]([^'"]+)['"]/)
  const actualPlan = planMatch?.[1] ?? null
  if (actualPlan !== source.plan) errors.push(`${id}: reviewed plan path does not match catalog data.`)
  if (source.plan && !fs.existsSync(path.join(root, 'public', source.plan.replace(/^\//, '')))) errors.push(`${id}: reviewed plan asset is missing.`)
  if (source.status === 'explicit-room-areas') {
    if (!Array.isArray(source.areas) || source.areas.length === 0 || source.areas.some(value => !Number.isFinite(value) || value <= 0)) errors.push(`${id}: explicit area list is invalid.`)
    if (source.labelsOnPlan !== false) errors.push(`${id}: unlabeled plan areas must remain neutral in the UI.`)
  } else if (source.areas !== undefined) errors.push(`${id}: inferred or unreviewed area values must not be published.`)
}
for (const id of Object.keys(sources)) if (!ids.includes(id)) errors.push(`${id}: room-area review references a model outside the catalog.`)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  const explicit = Object.values(sources).filter(source => source.status === 'explicit-room-areas').length
  const unavailable = Object.values(sources).filter(source => source.status === 'plan-unavailable').length
  console.log(`PASS — ${ids.length} models reviewed; ${explicit} plans explicitly state room areas; ${unavailable} models have no approved plan source. No areas inferred.`)
}
