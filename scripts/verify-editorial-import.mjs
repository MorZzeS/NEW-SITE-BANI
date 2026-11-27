import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
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
const currentArticles = new Map(exports.articles.map(article => [article.slug, article]))
const retainedRoutes = fixture.slugs.map(slug => currentArticles.has(slug))
assert(retainedRoutes.every(Boolean), 'A route from the approved November 16 article batch was removed')
const noticeExports = {}
const noticeCode = ts.transpileModule(fs.readFileSync(path.join(root, 'src/data/article-publication-notices.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
vm.runInNewContext(noticeCode, { exports: noticeExports })
const steamGunNotice = noticeExports.articlePublicationNotices['parovaya-pushka-v-bane']
assert(steamGunNotice?.text.includes('8 000 ₽'), 'Steam gun price clarification is required')
assert(steamGunNotice.text.includes('совместимость') && steamGunNotice.text.includes('недоступна для самостоятельного выбора в калькуляторе'), 'Steam gun article must disclose the unconfirmed compatibility status')
assert.equal(exports.articles.length, 28, 'The current 28-article package is authoritative')
assert(currentArticles.has('pochemu-karkasnaya-banya'), 'The production article route must remain published')
const productionProcessArticle = currentArticles.get('pochemu-karkasnaya-banya')
assert.equal(productionProcessArticle.title, 'Как проходит заказ мобильной бани BANGER: от выбора до разгрузки')
for (const step of ['Выбор модели и комплектации', 'Оформление заказа', 'Оплата', 'Производство', 'Поставка готовой бани', 'Разгрузка на участке заказчика']) {
  assert(productionProcessArticle.content.includes(step), `The approved customer process must include: ${step}`)
}
assert(!/подготовка пиломатериалов|нижняя обвязка|прокладка коммуникаций|установка печи и дымохода/i.test(productionProcessArticle.content), 'Do not present unverified factory details as facts')
console.log(JSON.stringify({ status: 'PASS', archivedSourceArticles: blocks.length, retainedHistoricalRoutes: retainedRoutes.length, currentArticles: exports.articles.length, currentArticlePackage: '2026-11-26' }, null, 2))
