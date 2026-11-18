import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'docs/editorial-assets/2026-11-16/GOTOVYE_STATI_DLYA_CODEX.md')
const source = fs.readFileSync(sourcePath, 'utf8').replaceAll('\r\n', '\n')
const exports = {}
const code = ts.transpileModule(fs.readFileSync(path.join(root, 'src/data/index.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
vm.runInNewContext(code, { exports })
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/approved-articles-20261116.json'), 'utf8'))
assert.equal(fixture.source, 'docs/editorial-assets/2026-11-16/GOTOVYE_STATI_DLYA_CODEX.md')
const blocks = source.split(/(?=^# )/m).filter(block => /^# (?!BANGER\.SU)/m.test(block) && /^\*\*Slug:\*\*/m.test(block))
assert.equal(blocks.length, 7)
assert.equal(blocks.map(block => block.match(/^\*\*Slug:\*\*\s*`([^`]+)`/m)?.[1]).join('|'), fixture.slugs.join('|'))
const imported = exports.articles.slice(-fixture.slugs.length)
assert.equal(Array.from(imported, article => article.slug).join('|'), fixture.slugs.join('|'))
const noticeExports = {}
const noticeCode = ts.transpileModule(fs.readFileSync(path.join(root, 'src/data/article-publication-notices.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
vm.runInNewContext(noticeCode, { exports: noticeExports })
const steamGunNotice = noticeExports.articlePublicationNotices['parovaya-pushka-v-bane']
assert(steamGunNotice?.text.includes('8 000 ₽'), 'Steam gun price clarification is required')
assert(steamGunNotice.text.includes('совместимость') && steamGunNotice.text.includes('недоступна для самостоятельного выбора в калькуляторе'), 'Steam gun article must disclose the unconfirmed compatibility status')
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const coverManifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/article-covers-source.json'), 'utf8'))
for (const [index, block] of blocks.entries()) {
  const article = imported[index]
  const lines = block.trim().split('\n')
  const title = lines.shift().replace(/^#\s+/, '').trim()
  const seoTitle = block.match(/^\*\*SEO title:\*\*\s*(.+)$/m)?.[1]?.trim()
  const metaDescription = block.match(/^\*\*Meta description:\*\*\s*(.+)$/m)?.[1]?.trim()
  const bodyStart = lines.findIndex(line => /^## /.test(line))
  assert(bodyStart >= 0, `${article.slug}: missing body`)
  const html = [], toc = []
  let number = 1, paragraph = []
  const flush = () => {
    if (!paragraph.length) return
    html.push(`<p>${escape(paragraph.join(' ').trim())}</p>`)
    paragraph = []
  }
  for (const line of lines.slice(bodyStart)) {
    if (!line.trim()) { flush(); continue }
    const heading = line.match(/^(#{2,3})\s+(.+)$/)
    if (heading) {
      flush()
      const level = heading[1].length, headingTitle = heading[2].trim(), id = `section-${number}`
      number += 2
      toc.push({ id, title: headingTitle, level })
      html.push(`<h${level} id="${id}">${escape(headingTitle)}</h${level}>`)
    } else paragraph.push(line.trim())
  }
  flush()
  assert.equal(article.title, title, `${article.slug}: source title`)
  assert.equal(article.seoTitle, seoTitle, `${article.slug}: SEO title`)
  assert.equal(article.metaDescription, metaDescription, `${article.slug}: meta description`)
  assert.equal(article.content, html.join('\n'), `${article.slug}: body text was changed during import`)
  assert.deepEqual(JSON.parse(JSON.stringify(article.toc)), toc, `${article.slug}: heading structure`)
  const cover = coverManifest.covers.find(item => item.slug === article.slug)
  assert(cover, `${article.slug}: missing image provenance`)
  const output = path.join(root, cover.output)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex'), cover.output_sha256, `${article.slug}: cover bytes`)
  assert.equal(article.coverImage, `/images/articles/${article.slug}-cover.webp`)
  assert.equal(article.imageCaption, article.photoBrief)
}
console.log(JSON.stringify({ status: 'PASS', importedArticles: imported.length, sourceMarkdownSha256: crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'), exactBodyComparison: true, coverHashes: true }, null, 2))
