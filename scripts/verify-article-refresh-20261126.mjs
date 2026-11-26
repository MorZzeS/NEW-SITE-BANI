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
const packagePath = path.join(root, 'docs/editorial-assets/2026-11-26/articles.json')
const manifestPath = path.join(root, 'docs/editorial-assets/2026-11-26/article-assets-manifest.json')
const source = fs.readFileSync(sourcePath, 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const exports = {}
vm.runInNewContext(output, { exports })
const articles = Array.from(exports.articles)
const sourceArticles = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const manufacturingMarkdown = fs.readFileSync(path.join(root, 'docs/editorial-assets/2026-11-26/pochemu-karkasnaya-banya-manufacturing.md'), 'utf8')

assert.equal(articles.length, 28, 'Public editorial catalogue must contain exactly 28 articles')
assert.equal(new Set(articles.map(article => article.slug)).size, 28, 'Article routes must be unique')
assert.equal(new Set(articles.map(article => article.title)).size, 28, 'Article titles must be unique')
assert.equal(new Set(articles.map(article => article.seoTitle)).size, 28, 'SEO titles must be unique')
assert.equal(new Set(articles.map(article => article.metaDescription)).size, 28, 'SEO descriptions must be unique')
assert.equal(new Set(articles.map(article => article.coverImage)).size, 28, 'Each article must use its own cover image')
assert.equal(articles.map(article => article.slug).sort().join('|'), sourceArticles.map(article => article.slug).sort().join('|'), 'All supplied URLs must be retained')
assert.throws(() => resolvePublicTarget(root, 'public/../../outside-file'), /canonical asset path/)
assert.throws(() => resolvePublicTarget(root, 'public//images/articles/2026-11-26/image.webp'), /canonical asset path/)
assert.throws(() => resolveArticleAssetUrl(root, '//evil.example/image.webp'), /Unexpected public URL/)
assert.throws(() => toArticleHtml('<img src=x onerror="alert(1)">\n\n## Section\n\n## Next', 'untrusted'), /raw HTML is not allowed/)
assert.throws(() => toArticleHtml('[bad](javascript:alert(1))\n\n## Section\n\n## Next', 'untrusted'), /approved JAMA Network HTTPS source/)
assert.throws(() => toArticleHtml('[bad](https://evil.example/track)\n\n## Section\n\n## Next', 'untrusted'), /approved JAMA Network HTTPS source/)

const sourceBySlug = new Map(sourceArticles.map(article => [article.slug, article]))
const manifestBySlug = new Map(manifest.articles.map(article => [article.slug, article]))
for (const article of articles) {
  const row = sourceBySlug.get(article.slug)
  assert(row, `${article.slug}: missing source article`)
  const markdown = article.slug === 'pochemu-karkasnaya-banya' ? manufacturingMarkdown : row.body_markdown
  const rendered = toArticleHtml(markdown, article.slug)
  assert.equal(article.content, rendered.content, `${article.slug}: rendered HTML must match the escaped Markdown importer output exactly`)
  assert(article.content.includes('<h2 id="section-1">'), `${article.slug}: first section anchor is missing`)
  assert.equal(JSON.stringify(article.toc), JSON.stringify(rendered.toc), `${article.slug}: table of contents must match its section headings exactly`)
  assert(article.coverImage?.startsWith('/images/articles/2026-11-26/'), `${article.slug}: incorrect cover location`)
  const localImage = resolveArticleAssetUrl(root, article.coverImage)
  assert(fs.existsSync(localImage), `${article.slug}: cover file is missing`)
  assert(article.coverAlt?.trim(), `${article.slug}: cover needs descriptive alt text`)
  assert(!/<script\b|javascript:/i.test(article.content), `${article.slug}: unsafe HTML detected`)
  if (article.slug !== 'pochemu-karkasnaya-banya') {
    const item = manifestBySlug.get(article.slug)
    assert(item?.used, `${article.slug}: package render is not marked as used`)
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(localImage)).digest('hex'), item.sha256.toLowerCase(), `${article.slug}: source render bytes changed`)
    assert.equal(article.title, row.title, `${article.slug}: supplied title changed`)
  } else {
    assert.equal(article.title, 'Как устроена каркасная баня BANGER: от производства до готового изделия')
    assert.equal(manifestBySlug.get(article.slug)?.used, false, 'The old wall-section render must remain unused')
    const generatedTarget = resolvePublicTarget(root, manifest.productionIllustration.target)
    assert.equal(article.coverImage, `/${manifest.productionIllustration.target.slice('public/'.length).replaceAll('\\', '/')}`)
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(generatedTarget)).digest('hex'), manifest.productionIllustration.sha256.toLowerCase(), 'Generated illustration bytes differ from the manifest')
    assert(article.content.includes('##') === false)
    for (const stage of ['пиломатериал', 'нижнюю обвязку', 'каркас', 'теплоизоляц', 'Пароизоляция', 'Коммуникации', 'отделка', 'дымоход', 'Контроль', 'доставк']) {
      assert(article.content.toLocaleLowerCase('ru').includes(stage.toLocaleLowerCase('ru')), `Production article is missing requested stage: ${stage}`)
    }
  }
}

console.log(JSON.stringify({ status: 'PASS', articles: articles.length, uniqueRoutes: 28, uniqueCovers: 28, providedRendersBytePreserved: 27, generatedProductionRender: manifest.productionIllustration.target }, null, 2))
