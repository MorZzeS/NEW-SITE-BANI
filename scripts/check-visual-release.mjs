import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'
import htmlParser from 'next/dist/compiled/node-html-parser/index.js'
import buildDocuments from './lead-build-documents.cjs'
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
const analyticsRequested = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
const metrikaId = (process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '').trim()
if (analyticsRequested && metrikaId !== '111684946') throw new Error('Analytics may only use the owner-approved Yandex Metrika counter 111684946')
if (isGitHubPagesProject && analyticsRequested) throw new Error('Analytics must remain disabled on GitHub Pages')
const analyticsEnabled = !isGitHubPagesProject && analyticsRequested && metrikaId === '111684946'
const root = path.resolve(isGitHubPagesProject ? 'dist-pages' : 'dist')
const files = fs.readdirSync(root, { recursive: true }).filter(name => fs.statSync(path.join(root, name)).isFile())
const htmlFiles = files.filter(name => name.endsWith('.html'))
if (!htmlFiles.length) throw new Error('Visual release export is missing')
const leadsEndpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT || ''
const leadContract = process.env.NEXT_PUBLIC_LEADS_CONTRACT || ''
const endpointConfigured = leadsEndpoint.length > 0
const leadDocumentBundle = buildDocuments.readLeadBuildDocuments(process.env)
const { isOnlineLeadReleaseReady } = loadTypeScriptModule('src/lib/lead-release-gate.ts')
const leadsEnabled = isOnlineLeadReleaseReady(leadsEndpoint, leadContract, leadDocumentBundle)
if (endpointConfigured && !leadsEnabled) throw new Error('Unsafe lead build: endpoint requires contract 3 and a complete approved document bundle')
if (leadsEnabled && leadsEndpoint !== 'https://banger.su/leads.php') throw new Error('Lead endpoint must be the reviewed SpaceWeb HTTPS handler')
const sourceFiles = fs.readdirSync('src', { recursive: true }).filter(name => /\.(?:ts|tsx|js|jsx)$/.test(name)).map(name => ({ path: `src/${name}`.replaceAll('\\', '/'), content: fs.readFileSync(path.join('src', name), 'utf8') }))
if (!sourceLeadTransportAllowed(sourceFiles)) throw new Error('Unsafe lead transport: browser POSTs must use the single gated SpaceWeb lead client')
for (const file of sourceFiles) assertNoUnsafeDynamicIframes(file.content, file.path)
const releaseProfile = leadsEnabled ? 'online-leads' : 'visual-contacts'
const artifactTextFiles = []
let onlineFormCount = 0
const leadClientSource = fs.readFileSync('src/lib/leads.ts', 'utf8')
if (!/export const leadEndpoint = process\.env\.NEXT_PUBLIC_LEADS_ENDPOINT \|\| ''/.test(leadClientSource)) throw new Error('Lead client must use the gated lead endpoint')
const policy = fs.readFileSync('src/lib/release-policy.ts', 'utf8')
if (!/isOnlineLeadReleaseReady\(/.test(policy) || !/\bonlineLeads:\s*leadsEndpointConfigured\b/.test(policy)) throw new Error('Unsafe release policy: onlineLeads must require the shared readiness gate')
if (!/analytics:\s*analyticsConfigured\b/.test(policy) || !/NEXT_PUBLIC_ANALYTICS_ENABLED/.test(policy) || !/NEXT_PUBLIC_YANDEX_METRIKA_ID/.test(policy) || !/BANGER_GITHUB_PAGES/.test(policy)) throw new Error('Unsafe release policy: analytics must require the approved production build flags and exclude GitHub Pages')
const analyticsSource = fs.readFileSync('src/lib/analytics.ts', 'utf8')
const analyticsGateSource = fs.readFileSync('src/components/privacy/AnalyticsGate.tsx', 'utf8')
const layoutSource = fs.readFileSync('src/app/layout.tsx', 'utf8')
if (!analyticsSource.includes("'111684946'") || !analyticsGateSource.includes('isProductionAnalyticsHost') || !analyticsGateSource.includes('webvisor: behaviorReplay') || !analyticsGateSource.includes('clickmap: behaviorReplay') || !analyticsGateSource.includes('trackLinks: false') || !analyticsGateSource.includes('accurateTrackBounce: false') || !analyticsGateSource.includes('trackHash: false') || !analyticsGateSource.includes('safeAnalyticsPath') || !analyticsGateSource.includes('analyticsConsentEventAllowsLoading') || !layoutSource.includes('<AnalyticsGate />')) throw new Error('Metrika source gate, consent/path safety, conditional Webvisor, disabled automatic tracking, or root integration missing')
const consentSource = fs.readFileSync('src/lib/analytics-consent.ts', 'utf8')
const leadFormSource = fs.readFileSync('src/components/forms/OnlineLeadForm.tsx', 'utf8')
const deliveryFieldsSource = fs.readFileSync('src/components/catalog/DeliveryFields.tsx', 'utf8')
const equipmentConfiguratorSource = fs.readFileSync('src/components/catalog/EquipmentConfigurator.tsx', 'utf8')
const modelConfigurationSource = fs.readFileSync('src/components/catalog/ModelBaseConfiguration.tsx', 'utf8')
const consentUiSource = fs.readFileSync('src/components/privacy/CookieConsent.tsx', 'utf8')
const legalSource = fs.readFileSync('src/data/site-legal.json', 'utf8')
if (!consentSource.includes("'banger-consent-v3'") || !consentSource.includes("'banger-analytics-denied'") || !consentSource.includes('isConsentStorageWritable') || !consentSource.includes('ANALYTICS_CONSENT_MAX_AGE_MS') || !consentSource.includes('ANALYTICS_CONSENT_CHANNEL') || !consentSource.includes('canResumeAnalyticsForTab') || !analyticsGateSource.includes('canResumeAnalyticsForTab') || !analyticsGateSource.includes('BroadcastChannel') || !analyticsGateSource.includes('window.setInterval(sync, 1000)') || !consentUiSource.includes('BroadcastChannel') || !consentUiSource.includes('Разрешить Вебвизор и карты кликов/ссылок') || !consentUiSource.includes('Только статистика') || consentUiSource.includes('Продолжить без сохранения') || !legalSource.includes('banger-analytics-denied') || !legalSource.includes('sessionStorage') || !/истечени[ея] одного года/.test(legalSource)) throw new Error('Analytics and Webvisor require separate saved choices, expiry, cross-tab refusal, and a fail-closed refusal fallback')
if (!leadFormSource.includes('ym-disable-keys') || !deliveryFieldsSource.includes('ym-disable-keys') || !leadFormSource.includes('ym-hide-content') || !legalSource.includes('Вебвизор и карты кликов/ссылок') || !/карта скроллинга и отч[её]ты аналитики форм/i.test(legalSource) || !legalSource.includes('не поддерживаются') || !/пункту? 1 части 1 статьи 6 Федерального закона №152-ФЗ/.test(legalSource) || !legalSource.includes('средствами Яндекс Метрики') || /Вебвизор (?:выключен|отключён|отключен)|Вебвизор и карта кликов отключены/i.test(legalSource)) throw new Error('Webvisor privacy disclosure, legal basis, SPA limitations, and form masking must match runtime behavior')
if (!equipmentConfiguratorSource.includes('ym-hide-content') || !modelConfigurationSource.includes('ym-hide-content') || !/className="ym-hide-content">\{totalText\}/.test(modelConfigurationSource)) throw new Error('Dynamic calculator summaries, selected options, and totals must be masked in Webvisor')
for (const goal of ['lead_success', 'phone_click', 'max_click', 'telegram_click', 'calculator_start', 'pdf_download', 'model_view', 'project_view']) {
  if (!analyticsSource.includes(`'${goal}'`) && !analyticsGateSource.includes(`'${goal}'`) && !sourceFiles.some(file => file.content.includes(`'${goal}'`))) throw new Error(`Required analytics goal is missing: ${goal}`)
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
  const metrikaReferences = [...content.matchAll(/https?:\/\/mc\.yandex\.(?:ru|com)\/[^\s"'`\\)]+/g)].map(match => match[0])
  if (metrikaReferences.some(url => url !== 'https://mc.yandex.ru/metrika/tag.js')) throw new Error(`Unapproved Yandex Metrika endpoint: ${name}`)
  if (metrikaReferences.length && !name.endsWith('.js')) throw new Error(`Metrika script URL must not be in a static artifact: ${name}`)
  if (/api\.met\.no\/weatherapi|api\.open-meteo\.com\/|platform-api2\.max\.ru/.test(content)) throw new Error(`Disabled service shipped: ${name}`)
  if (forbiddenCopy.test(content) || /bestseller-bow-a\.svg/.test(content)) throw new Error(`Superseded owner copy or bow reference: ${name}`)
}
if (leadsEnabled && (!compiledLeadEndpointPresent(artifactTextFiles, leadsEndpoint) || onlineFormCount === 0)) throw new Error('Approved lead build is missing its exact compiled endpoint or active form')
for (const name of htmlFiles) {
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (/weather-strip-section|weather-strip-toggle|Погода для загородного отдыха/u.test(html)) throw new Error(`Temporarily disabled weather UI leaked into ${name}`)
  if (!leadsEnabled && /<form\b/i.test(html)) throw new Error(`Unexpected collection surface: ${name}`)
  validateYandexEmbedArtifact(html, name, automaticYandexEmbeds)
  const catalogRedirect = name === 'katalog.html' && html.includes('NEXT_REDIRECT;replace;/katalog/bani;307;') && html.includes('href="https://banger.su/katalog/bani"')
  const disabledTestRoute = name === 'test-leads.html' && !/<form\b|leads\.php/i.test(html) && /<meta name="robots" content="noindex/i.test(html)
  if (!html.includes(`data-release-profile="${releaseProfile}"`) && !catalogRedirect && !disabledTestRoute) throw new Error(`Wrong release profile: ${name}`)
  if (name === 'test-leads.html' && !disabledTestRoute) throw new Error('Production test-leads artifact must be non-interactive and noindex')
  if (leadsEnabled && /<form\b/i.test(html)) {
    for (const form of htmlParser.parse(html).querySelectorAll('form')) {
      for (const kind of ['checkbox', 'consent', 'policy']) verifyRenderedDocument(form, kind, name)
    }
  }
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
function verifyRenderedDocument(root, kind, name) {
  const elements = root.querySelectorAll(`[data-lead-document="${kind}"]`)
  if (elements.length !== 1 || elements[0].textContent !== leadDocumentBundle.documents[kind].text) {
    throw new Error(`Rendered ${kind} does not match the pinned lead archive: ${name}`)
  }
}
for (const route of ['privacy', 'politika', 'cookie', 'soglasie-pd', 'soglasie-reklama']) {
  const name = htmlFiles.find(name => name === `${route}.html` || name === `${route}/index.html`)
  if (!name) throw new Error(`Missing information route: ${route}`)
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (leadsEnabled && route === 'soglasie-pd') {
    verifyRenderedDocument(htmlParser.parse(html), 'consent', name)
  } else if (['privacy', 'politika'].includes(route) && (!html.includes('111684946') || !html.includes('отдельного сохранённого выбора посетителя') || !html.includes('подготовка и запуск скачивания PDF'))) {
    throw new Error('Current privacy page must explain the optional Metrika consent separately from the pinned lead form snapshot')
  } else if (route === 'cookie' && (!html.includes('111684946') || !html.includes('подготовка и запуск скачивания PDF'))) {
    throw new Error('Cookie page must describe the current analytics choice and tracked event categories')
  } else if (/не передаются третьим|база.*на территории РФ|требует проверки владельцем|черновик/iu.test(html)) {
    throw new Error(`Unapproved legal assertion: ${route}`)
  }
}
const sha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Invalid public release SHA')
fs.writeFileSync(path.join(root, 'release.json'), JSON.stringify({ profile: leadsEnabled ? 'online-leads' : 'visual-contacts', sha, basePath, onlineLeads: leadsEnabled, analytics: analyticsEnabled, webvisor: analyticsEnabled, behaviorReplayRequiresConsent: analyticsEnabled, clickmap: analyticsEnabled, linkmap: analyticsEnabled, scrollmap: false, formAnalytics: false, weather: 'disabled', weatherTransport: 'none', embeddedYandex: automaticYandexEmbeds ? 'automatic' : false, promotionalOffer: true }) + '\n')
console.log(`Release export PASS: ${htmlFiles.length} HTML, ${leadsEnabled ? `online lead form enabled through ${leadsEndpoint}` : 'contacts only'}, analytics ${analyticsEnabled ? `enabled after consent with counter ${metrikaId}; Webvisor and click/link maps require separate opt-in; scrollmap and form reports are unsupported on this SPA` : 'disabled'}, weather UI and snapshots disabled; legal acceptance required separately`)
