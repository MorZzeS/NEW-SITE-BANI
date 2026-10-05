import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const config = require('../next.config.js')
const dist = path.resolve(config.distDir || 'dist')
const ts = require('typescript')
const data = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/index.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: data })
const { articles } = data
const approved = JSON.parse(fs.readFileSync('docs/articles-word-source.json', 'utf8')).articles

if (new Set(articles.map((a) => a.slug)).size !== articles.length || approved.some((a) => !articles.some((item) => item.slug === a.slug))) {
  throw new Error('Expected unique article slugs and all 20 approved Word articles')
}
for (const { slug } of articles) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Unsafe article slug: ${slug}`)
  const source = path.join(dist, 'poleznoe', `${slug}.html`)
  const directory = path.join(dist, 'poleznoe', slug)
  const html = fs.readFileSync(source, 'utf8')
  if (!html.includes(`rel="canonical" href="https://banger.su/poleznoe/${slug}"`)) {
    throw new Error(`Missing canonical without trailing slash: ${slug}`)
  }
  fs.mkdirSync(directory, { recursive: true })
  fs.copyFileSync(source, path.join(directory, 'index.html'))
}
console.log(`PASS: ${articles.length}/${articles.length} static article slash aliases; original .html routes preserved`)
