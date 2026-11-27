import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { toArticleHtml } from './lib/article-markdown.mjs'
import { resolveArticleAssetUrl, resolvePublicTarget } from './lib/public-assets.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'src/data/index.ts')
const sourceArticlesPath = path.join(root, 'docs/editorial-assets/2026-11-27/articles-clean.json')
const preservedPath = path.join(root, 'docs/editorial-assets/2026-11-27/article-preserved-fields.json')
const manifestPath = path.join(root, 'docs/editorial-assets/2026-11-26/article-assets-manifest.json')
const visualsPath = path.join(root, 'src/data/article-visuals.ts')
const source = fs.readFileSync(sourcePath, 'utf8')
const clean = JSON.parse(fs.readFileSync(sourceArticlesPath, 'utf8'))
const preserved = JSON.parse(fs.readFileSync(preservedPath, 'utf8'))
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const manifestBySlug = new Map(manifest.articles.map(article => [article.slug, article]))
const preservedBySlug = new Map(preserved.map(article => [article.slug, article]))

function readInitializer(sourceText, name, fileName) {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer) {
        return vm.runInNewContext('(' + declaration.initializer.getText(sourceFile) + ')')
      }
    }
  }
  throw new Error('missing_initializer:' + name)
}
const articles = readInitializer(source, 'articles', sourcePath)
const articleVisuals = readInitializer(fs.readFileSync(visualsPath, 'utf8'), 'articleInlineVisuals', visualsPath)
const preservedKeys = ['id', 'slug', 'coverImage', 'coverAlt', 'image', 'imageAvif', 'imageAlt', 'imageCaption', 'imageWidth', 'imageHeight', 'category', 'date', 'presentation', 'relatedSlugs', 'resourceLinks', 'photoBrief']

assert.equal(articles.length, 28, 'Public article count must be 28')
assert.equal(clean.articles.length, 28, 'Source article count must be 28')
assert.equal(new Set(articles.map(article => article.slug)).size, 28, 'Routes must be unique')
assert.equal(new Set(articles.map(article => article.title)).size, 28, 'Titles must be unique')
assert.equal(new Set(articles.map(article => article.seoTitle)).size, 28, 'SEO titles must be unique')
assert.equal(new Set(articles.map(article => article.metaDescription)).size, 28, 'SEO descriptions must be unique')
assert.equal(new Set(articles.map(article => article.coverImage)).size, 28, 'Existing unique covers must remain')
assert.equal(articles.map(article => article.slug).join('\n'), clean.articles.map(article => article.slug).join('\n'), 'Existing route order and slugs must be retained')
assert.equal(preserved.length, 28, 'Preservation fixture must cover every article')

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
function expectedArticle(blocks) {
  let h2 = 0, h3 = 0, faq = 0, words = 0
  const html = [], toc = []
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      words += (block.text.match(/\S+/gu) || []).length
      html.push('<p>' + escapeHtml(block.text) + '</p>')
    } else if (block.type === 'heading') {
      const level = block.level === 3 ? 3 : 2
      const id = level === 2 ? 'section-' + (1 + h2++ * 2) : 'subsection-' + (++h3)
      words += (block.text.match(/\S+/gu) || []).length
      html.push('<h' + level + ' id="' + id + '">' + escapeHtml(block.text) + '</h' + level + '>')
      toc.push({ id, title: block.text, level })
    } else if (block.type === 'faqItem') {
      const id = 'faq-' + (++faq)
      words += (block.question.match(/\S+/gu) || []).length + (block.answer.match(/\S+/gu) || []).length
      html.push('<section class="article-faq-item"><h3 id="' + id + '">' + escapeHtml(block.question) + '</h3><p>' + escapeHtml(block.answer) + '</p></section>')
    } else {
      throw new Error('unsupported_content_block:' + block.type)
    }
  }
  return { html: html.join('\n'), toc, readTime: Math.max(1, Math.ceil(words / 180)) }
}

let retainedImages = 0, totalBlocks = 0
const sourceBySlug = new Map(clean.articles.map(article => [article.slug, article]))
for (const article of articles) {
  const item = sourceBySlug.get(article.slug)
  const original = preservedBySlug.get(article.slug)
  assert(item && original, article.slug + ': source/preservation row missing')
  const expected = expectedArticle(item.contentBlocks)
  const firstParagraph = item.contentBlocks.find(block => block.type === 'paragraph')?.text || item.description
  assert.equal(article.title, item.title, article.slug + ': publication title differs from approved clean source')
  assert.equal(article.seoTitle, item.seoTitle, article.slug + ': SEO title differs from approved clean source')
  assert.equal(article.metaDescription, item.description, article.slug + ': SEO description differs from approved clean source')
  assert.equal(article.excerpt, firstParagraph, article.slug + ': preview excerpt should follow the publication body')
  assert.equal(article.content, expected.html, article.slug + ': public body must preserve all cleaned source blocks')
  assert.equal(JSON.stringify(article.toc), JSON.stringify(expected.toc), article.slug + ': H2/H3 structure and TOC must match')
  assert.equal(article.readTime, expected.readTime, article.slug + ': reading time should match body length')
  assert.equal(article.updatedAt, '2026-11-27', article.slug + ': update date mismatch')
  for (const key of preservedKeys) assert.equal(JSON.stringify(article[key] ?? null), JSON.stringify(original[key] ?? null), article.slug + ': preserved ' + key + ' changed')
  assert(article.coverImage?.startsWith('/images/articles/'), article.slug + ': local cover path required')
  assert(article.coverAlt?.trim(), article.slug + ': cover alt text required')
  const localImage = resolveArticleAssetUrl(root, article.coverImage)
  assert(fs.existsSync(localImage), article.slug + ': existing cover missing')
  if (article.slug === 'pochemu-karkasnaya-banya') {
    const target = resolvePublicTarget(root, manifest.productionIllustration.target)
    assert.equal(article.coverImage, '/' + manifest.productionIllustration.target.slice('public/'.length).replaceAll('\\', '/'), 'production illustration should be retained')
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'), manifest.productionIllustration.sha256.toLowerCase(), 'production illustration changed')
  } else {
    const manifestRow = manifestBySlug.get(article.slug)
    assert(manifestRow?.used, article.slug + ': existing package render should remain assigned')
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(localImage)).digest('hex'), manifestRow.sha256.toLowerCase(), article.slug + ': existing cover bytes changed')
  }
  const serviceText = /SEO Title|SEO Description|служебный блок|текст статьи для публикации|комментарий редактора/i
  assert(!serviceText.test(article.content), article.slug + ': editor instructions leaked into publication')
  assert(!/<script\b|javascript:/i.test(article.content), article.slug + ': unsafe markup')
  const requiredVisuals = articleVisuals[article.slug] || []
  for (const visual of requiredVisuals) assert(article.content.includes('<h2 id="' + visual.beforeSection + '">'), article.slug + ': inline visual anchor missing: ' + visual.beforeSection)
  for (const related of article.relatedSlugs || []) assert(sourceBySlug.has(related), article.slug + ': related route missing: ' + related)
  totalBlocks += item.contentBlocks.length
  retainedImages += 1
}

assert.throws(() => resolvePublicTarget(root, 'public/../../outside-file'), /canonical asset path/)
assert.throws(() => resolvePublicTarget(root, 'public//images/articles/2026-11-26/image.webp'), /canonical asset path/)
assert.throws(() => resolveArticleAssetUrl(root, '//evil.example/image.webp'), /Unexpected public URL/)
assert.throws(() => toArticleHtml('<img src=x onerror="alert(1)">\n\n## Section\n\n## Next', 'untrusted'), /raw HTML is not allowed/)
assert.throws(() => toArticleHtml('[bad](javascript:alert(1))\n\n## Section\n\n## Next', 'untrusted'), /approved JAMA Network HTTPS source/)
assert.throws(() => toArticleHtml('[bad](https://evil.example/track)\n\n## Section\n\n## Next', 'untrusted'), /approved JAMA Network HTTPS source/)

console.log(JSON.stringify({ status: 'PASS', articles: articles.length, uniqueRoutes: 28, totalSourceBlocks: totalBlocks, existingCoversRetained: retainedImages, inlineVisualAnchors: Object.values(articleVisuals).flat().length, slugsAndRelatedRoutesPreserved: true }, null, 2))
