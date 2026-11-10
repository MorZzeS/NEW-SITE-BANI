import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'
import { compiledLeadEndpointPresent, leadArtifactFileAllowed, sourceLeadTransportAllowed } from './lead-artifact-gate.mjs'
import { assertNoUnsafeDynamicIframes, validateYandexEmbedArtifact } from './yandex-embed-artifact-gate.mjs'

function loadTypeScriptModule(file) {
  const source = fs.readFileSync(file, 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const loaded = { exports: {} }
  new Function('exports', 'require', 'module', output)(loaded.exports, () => { throw new Error('Unexpected import in ' + file) }, loaded)
  return loaded.exports
}


const isGitHubPagesProject = process.env.BANGER_GITHUB_PAGES === 'true'
const basePath = isGitHubPagesProject ? '/NEW-SITE-BANI' : ''
const root = path.resolve(isGitHubPagesProject ? 'dist-pages' : 'dist')
const files = fs.readdirSync(root, { recursive: true }).filter(name => fs.statSync(path.join(root, name)).isFile())
const htmlFiles = files.filter(name => name.endsWith('.html'))
if (!htmlFiles.length) throw new Error('Visual release export is missing')
const leadsEndpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT || ''
const leadContract = process.env.NEXT_PUBLIC_LEADS_CONTRACT || ''
const endpointConfigured = leadsEndpoint.length > 0
const { leadDocumentBundle } = loadTypeScriptModule('src/data/lead-documents.ts')
const { isOnlineLeadReleaseReady } = loadTypeScriptModule('src/lib/lead-release-gate.ts')
const leadsEnabled = isOnlineLeadReleaseReady(leadsEndpoint, leadContract, leadDocumentBundle)
if (endpointConfigured && !leadsEnabled) throw new Error('Unsafe lead build: endpoint requires contract 3 and a complete approved document bundle')
if (leadsEnabled && leadsEndpoint !== 'https://banger.su/leads.php') throw new Error('Lead endpoint must be the reviewed SpaceWeb HTTPS handler')
const sourceFiles = fs.readdirSync('src', { recursive: true }).filter(name => /\.(?:ts|tsx|js|jsx)$/.test(name)).map(name => ({ path: `src/${name}`.replaceAll('\\', '/'), content: fs.readFileSync(path.join('src', name), 'utf8') }))
if (!sourceLeadTransportAllowed(sourceFiles)) throw new Error('Unsafe lead transport: browser POSTs must use the single gated SpaceWeb lead client')
for (const file of sourceFiles) assertNoUnsafeDynamicIframes(file.content, file.path)
const releaseProfiles = leadsEnabled ? ['visual-contacts', 'online-leads'] : ['visual-contacts']
const artifactTextFiles = []
let onlineFormCount = 0
const leadClientSource = fs.readFileSync('src/lib/leads.ts', 'utf8')
if (!/export const leadEndpoint = process\.env\.NEXT_PUBLIC_LEADS_ENDPOINT \|\| ''/.test(leadClientSource) || !/fetch\(\s*leadEndpoint,\s*\{\s*method:\s*'POST'/s.test(leadClientSource)) throw new Error('Lead client must POST through the gated leadEndpoint')
const policy = fs.readFileSync('src/lib/release-policy.ts', 'utf8')
if (!/isOnlineLeadReleaseReady\(/.test(policy) || !/\bonlineLeads:\s*leadsEndpointConfigured\b/.test(policy)) throw new Error('Unsafe release policy: onlineLeads must require the shared readiness gate')
for (const flag of ['analytics']) {
  if (!new RegExp(`\\b${flag}:\\s*false\\b`).test(policy)) throw new Error(`Unsafe release policy: ${flag}`)
}
const automaticYandexEmbeds = /\bembeddedYandex:\s*'automatic'/.test(policy)
if (!automaticYandexEmbeds && !/\bembeddedYandex:\s*false\b/.test(policy)) throw new Error('Missing explicit Yandex embed policy')
if (automaticYandexEmbeds) {
  for (const component of ['YandexMapEmbed', 'YandexReviewsWidget']) {
    const source = fs.readFileSync(`src/components/integrations/${component}.tsx`, 'utf8')
    if (source.includes('useState(') || source.includes('setLoaded') || !source.includes('loading="eager"') || !source.includes('<iframe')) throw new Error(`Yandex widget must load automatically from its approved embed URL: ${component}`)
  }
}
if (!/\bweather:\s*'disabled'/.test(policy) || !/\bweatherTransport:\s*'none'/.test(policy) || !/\bpromotionalOffer:\s*true\b/.test(policy)) throw new Error('Owner-approved release policy changed')
const nextConfig = fs.readFileSync('next.config.js', 'utf8')
if (isGitHubPagesProject && !/basePath:\s*githubPagesBasePath/.test(nextConfig)) throw new Error('GitHub Pages basePath configuration missing')
const homeSource = fs.readFileSync('src/app/page.tsx', 'utf8')
const headerSource = fs.readFileSync('src/components/layout/Header.tsx', 'utf8')
if (headerSource.includes('<WeatherWide') || headerSource.includes('weather-expanded-spacer') || !homeSource.includes('<ExitIntentOffer')) throw new Error('Weather must remain temporarily unmounted; homepage exit-intent entry point is required')
if (fs.existsSync(path.join(root, 'weather'))) throw new Error('Temporarily disabled weather snapshots must not ship in the export')
const forbiddenCopy = /Сведения о конкретном клиентском объекте и его комплектации не указаны|Информация о клиенте и характеристиках объекта не указана|История клиента и характеристики объекта не указаны|Работаем с труднодоступными участками|Базальтовая теплоизоляция без вредных смол|Подключаем коммуникации/iu
for (const name of files) {
  const normalized = name.replaceAll('\\', '/')
  if (/(^|\/)(?:docs|backend|node_modules|\.git)(\/|$)|(^|\/)\.env(?:\.|$)|\.map$/i.test(normalized)) throw new Error(`Private deployment file: ${name}`)
  if (!/\.(?:html|js|json|txt|xml|svg)$/i.test(name)) continue
  const content = fs.readFileSync(path.join(root, name), 'utf8')
  artifactTextFiles.push({ path: name.replaceAll('\\', '/'), content })
  if (name.endsWith('.js')) assertNoUnsafeDynamicIframes(content, name.replaceAll('\\', '/'))
  if (!leadArtifactFileAllowed(name.replaceAll('\\', '/'), content, leadsEnabled)) throw new Error('Lead artifact/profile mismatch: ' + name)
  if (name.endsWith('.html') && leadsEnabled && /<form\b/i.test(content)) onlineFormCount++
  if (/(?:MAX_BOT_TOKEN|MAX_USER_ID|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(content)) throw new Error(`Unexpected server-only material: ${name}`)
  if (/mc\.yandex\.(?:ru|com)\/|api\.met\.no\/weatherapi|api\.open-meteo\.com\/|platform-api2\.max\.ru/.test(content)) throw new Error(`Disabled service shipped: ${name}`)
  if (forbiddenCopy.test(content) || /bestseller-bow-a\.svg/.test(content)) throw new Error(`Superseded owner copy or bow reference: ${name}`)
}
if (leadsEnabled && (!compiledLeadEndpointPresent(artifactTextFiles, leadsEndpoint) || onlineFormCount === 0)) throw new Error('Approved lead build is missing its exact compiled endpoint or active form')
for (const name of htmlFiles) {
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (/weather-strip-section|weather-strip-toggle|Погода для загородного отдыха/u.test(html)) throw new Error(`Temporarily disabled weather UI leaked into ${name}`)
  if (!leadsEnabled && /<form\b/i.test(html)) throw new Error(`Unexpected collection surface: ${name}`)
  if (leadsEnabled && /<iframe\b/i.test(html)) throw new Error(`Unexpected embed surface: ${name}`)
  validateYandexEmbedArtifact(html, name, automaticYandexEmbeds)
  const catalogRedirect = name === 'katalog.html' && html.includes('NEXT_REDIRECT;replace;/katalog/bani;307;') && html.includes('href="https://banger.su/katalog/bani"')
  if (!releaseProfiles.some(profile => html.includes(`data-release-profile="${profile}"`)) && !catalogRedirect) throw new Error(`Wrong release profile: ${name}`)
  if (isGitHubPagesProject && !/<meta name="robots" content="noindex, (?:no)?follow"/.test(html)) throw new Error(`Test Pages build must be noindex: ${name}`)
  if (isGitHubPagesProject && /(?:src|href|srcset|poster)=["']\/(?:_next|images|videos|favicon|icon|apple-touch)/i.test(html)) throw new Error(`Unprefixed root asset in test Pages HTML: ${name}`)
  if (isGitHubPagesProject) {
    const rootUrls = [...html.matchAll(/(?:href|src|srcset|poster)=["'](\/(?!\/)[^"']*)["']/gi)].map((match) => match[1])
    const missingBase = rootUrls.find((url) => url !== basePath && !url.startsWith(`${basePath}/`) && !url.startsWith('/#'))
    if (missingBase) throw new Error(`Unprefixed root path ${missingBase} in test Pages HTML: ${name}`)
  }
  if (/Заявка отправлена\./u.test(html)) throw new Error(`False submission confirmation: ${name}`)
  if (/<script[^>]+src=["']https?:\/\/|<link[^>]+rel=["'](?:preconnect|dns-prefetch)["'][^>]+href=["']https?:\/\//i.test(html)) throw new Error(`Automatic external resource: ${name}`)
  if (/(?:MAX_BOT_TOKEN|MAX_USER_ID|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(html)) throw new Error(`Unexpected server-only material: ${name}`)
}
if (isGitHubPagesProject) {
  for (const name of files.filter((name) => name.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(root, name), 'utf8')
    if (/url\(["']?\/(?!\/)(?!NEW-SITE-BANI\/)/i.test(css)) throw new Error(`Unprefixed root URL in test Pages CSS: ${name}`)
  }
}
for (const route of ['privacy', 'politika', 'cookie', 'soglasie-pd', 'soglasie-reklama']) {
  const name = htmlFiles.find(name => name === `${route}.html` || name === `${route}/index.html`)
  if (!name) throw new Error(`Missing information route: ${route}`)
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (/не передаются третьим|база.*на территории РФ|требует проверки владельцем|черновик/iu.test(html)) throw new Error(`Unapproved legal assertion: ${route}`)
}
const sha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Invalid public release SHA')
fs.writeFileSync(path.join(root, 'release.json'), JSON.stringify({ profile: leadsEnabled ? 'online-leads' : 'visual-contacts', sha, basePath, onlineLeads: leadsEnabled, analytics: false, weather: 'disabled', weatherTransport: 'none', embeddedYandex: automaticYandexEmbeds ? 'automatic' : false, promotionalOffer: true }) + '\n')
console.log(`Release export PASS: ${htmlFiles.length} HTML, ${leadsEnabled ? `online lead form enabled through ${leadsEndpoint}` : 'contacts only'}, weather UI and snapshots disabled, city component/source data retained in the repository for redesign, desktop offer retained; browser and legal acceptance required separately`)
