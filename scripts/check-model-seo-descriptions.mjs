import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const checkArtifact = process.argv.includes('--artifact')

function decodeHtml(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' }
  return value.replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|quot|apos|lt|gt|nbsp));/giu, (_, decimal, hex, name) => {
    if (decimal || hex) return String.fromCodePoint(Number.parseInt(decimal ?? hex, decimal ? 10 : 16))
    return named[name.toLowerCase()]
  })
}

function descriptionTags(html, channel) {
  return Array.from(html.matchAll(/<meta\b[^>]*>/giu), ([tag]) => {
    const attributes = Object.fromEntries(Array.from(tag.matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gu), ([, name, doubleQuoted, singleQuoted, unquoted]) => [name.toLowerCase(), decodeHtml(doubleQuoted ?? singleQuoted ?? unquoted)]))
    const key = channel === 'og:description' ? 'property' : 'name'
    return attributes[key] === channel ? attributes : null
  }).filter(Boolean)
}

function load(relative, dependencies = {}) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    fileName: relative,
  })
  const exports = {}
  // Page UI dependencies are unused: exercise generateMetadata without rendering the page.
  vm.runInNewContext(outputText, { exports, require: name => dependencies[name] ?? {} }, { filename: relative })
  return exports
}

const data = load('src/data/index.ts')
const seo = load('src/lib/model-seo.ts')
const dependencies = { '@/data': data, '@/lib/model-seo': seo }
const descriptions = new Set()
const artifactDescriptions = new Set()
const samples = []
let count = 0

for (const [route, models, kind] of [['banya', data.saunas, 'sauna'], ['dom', data.homes, 'home']]) {
  const { generateMetadata } = load(`src/app/${route}/[slug]/page.tsx`, dependencies)
  assert.equal(Object.keys(await generateMetadata({ params: Promise.resolve({ slug: 'missing-model' }) })).length, 0)

  for (const model of models) {
    const url = `https://banger.su/${route}/${model.slug}`
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: model.slug }) })
    const description = metadata.description
    assert.equal(typeof description, 'string', `${url}: description is present`)
    assert.ok(description.includes(`«${model.name}»`), `${url}: exact model identity`)
    assert.ok(description.includes(model.size.replace(/\s*\+\s*крыльцо\s*$/u, ' с крыльцом')), `${url}: source size`)
    assert.ok(!/\.{2,}|[.!?]\s+[.!?]/u.test(description), `${url}: no duplicate punctuation`)
    const sentences = description.split(/[.!?]+(?:\s+|$)/u).filter(Boolean).map(value => value.trim().toLocaleLowerCase('ru-RU'))
    assert.equal(new Set(sentences).size, sentences.length, `${url}: no repeated sentences`)
    assert.ok(!descriptions.has(description), `${url}: distinct model description`)
    descriptions.add(description)
    assert.equal(metadata.openGraph.description, description, `${url}: OG matches meta`)
    assert.equal(metadata.twitter.description, description, `${url}: Twitter matches meta`)
    assert.equal(metadata.alternates.canonical, url, `${url}: canonical preserved`)
    assert.equal(metadata.openGraph.url, url, `${url}: OG URL preserved`)
    const title = kind === 'sauna' ? `${model.name} — мобильная баня ${model.size}` : `${model.name} — ${model.size}`
    assert.equal(metadata.title, title, `${url}: title preserved`)
    assert.equal(metadata.openGraph.title, title, `${url}: OG title preserved`)
    assert.equal(metadata.openGraph.images[0].url, model.image.startsWith('http') ? model.image : `https://banger.su${model.image}`, `${url}: image preserved`)
    assert.equal(metadata.openGraph.images[0].alt, model.name, `${url}: image alt preserved`)
    if (kind === 'home') assert.ok(!/бан[яиюе]|парн/iu.test(description), `${url}: no copied sauna claims`)
    if (checkArtifact) {
      const file = path.join(root, 'dist', route, `${model.slug}.html`)
      const html = fs.readFileSync(file, 'utf8')
      const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/iu)?.[1]
      assert.ok(head, `${file}: head is present`)
      for (const channel of ['description', 'og:description', 'twitter:description']) {
        const tags = descriptionTags(html, channel)
        assert.equal(tags.length, 1, `${file}: exactly one ${channel} tag in HTML`)
        assert.equal(descriptionTags(head, channel).length, 1, `${file}: ${channel} is in head`)
        assert.equal(tags[0].content, description, `${file}: rendered ${channel} matches current generated description`)
      }
      const rendered = descriptionTags(html, 'description')[0].content
      assert.ok(!artifactDescriptions.has(rendered), `${file}: unique rendered description`)
      artifactDescriptions.add(rendered)
    }
    if (['skandinaviya-komfort-6', 'sever-layt-4', 'istok-grafit-4', 'usadba-praktik'].includes(model.slug)) samples.push({ url, description })
    count++
  }
}

assert.equal(count, 31, 'all 25 sauna and 6 home descriptions checked')
if (checkArtifact) assert.equal(artifactDescriptions.size, 31, 'all 31 artifact descriptions are unique')
const source = { name: 'Проверка', size: '6 × 2,4 м', subtitle: 'Отдельная моечная зона..', description: 'Отдельная моечная зона. Боковой вход' }
const normalized = seo.getModelSeoDescription(source, 'sauna')
assert.equal(normalized, 'Мобильная баня «Проверка» размером 6 × 2,4 м. Отдельная моечная зона. Боковой вход.', 'deduplicate shared text, normalize punctuation, retain distinct source detail')
console.log(JSON.stringify({ status: 'PASS', models: count, uniqueDescriptions: descriptions.size, channels: ['meta', 'openGraph', 'twitter'], ...(checkArtifact ? { artifact: { directory: 'dist', pages: count, uniqueDescriptions: artifactDescriptions.size, tagsPerPage: 3, totalDescriptionTags: count * 3, location: 'head' } } : {}), samples }, null, 2))
