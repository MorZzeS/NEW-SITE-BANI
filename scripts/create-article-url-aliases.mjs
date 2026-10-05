import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const config = require('../next.config.js')
const dist = path.resolve(config.distDir || 'dist')
const { articles } = JSON.parse(fs.readFileSync('docs/articles-word-source.json', 'utf8'))

if (articles.length !== 20 || new Set(articles.map((a) => a.slug)).size !== 20) {
  throw new Error('Expected 20 unique approved article slugs')
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
console.log('PASS: 20/20 static article slash aliases; original .html routes preserved')
