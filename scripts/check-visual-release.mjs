import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const isGitHubPagesProject = process.env.BANGER_GITHUB_PAGES === 'true'
const basePath = isGitHubPagesProject ? '/NEW-SITE-BANI' : ''
const root = path.resolve(isGitHubPagesProject ? 'dist-pages' : 'dist')
const files = fs.readdirSync(root, { recursive: true }).filter(name => fs.statSync(path.join(root, name)).isFile())
const htmlFiles = files.filter(name => name.endsWith('.html'))
if (!htmlFiles.length) throw new Error('Visual release export is missing')
const policy = fs.readFileSync('src/lib/release-policy.ts', 'utf8')
for (const flag of ['onlineLeads', 'analytics', 'embeddedYandex']) {
  if (!new RegExp(`\\b${flag}:\\s*false\\b`).test(policy)) throw new Error(`Unsafe release policy: ${flag}`)
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
  if (/(?:MAX_BOT_TOKEN|MAX_USER_ID|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(content)) throw new Error(`Unexpected server-only material: ${name}`)
  if (/mc\.yandex\.(?:ru|com)\/|api\.met\.no\/weatherapi|api\.open-meteo\.com\/|banger-leads\.onrender\.com|platform-api2\.max\.ru/.test(content)) throw new Error(`Disabled service shipped: ${name}`)
  if (forbiddenCopy.test(content) || /bestseller-bow-a\.svg/.test(content)) throw new Error(`Superseded owner copy or bow reference: ${name}`)
}
for (const name of htmlFiles) {
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (/weather-strip-section|weather-strip-toggle|Погода для загородного отдыха/u.test(html)) throw new Error(`Temporarily disabled weather UI leaked into ${name}`)
  if (/<form\b|<iframe\b/i.test(html)) throw new Error(`Unexpected collection or embed surface: ${name}`)
  const catalogRedirect = name === 'katalog.html' && html.includes('NEXT_REDIRECT;replace;/katalog/bani;307;') && html.includes('href="https://banger.su/katalog/bani"')
  if (!html.includes('data-release-profile="visual-contacts"') && !catalogRedirect) throw new Error(`Wrong release profile: ${name}`)
  if (isGitHubPagesProject && !/<meta name="robots" content="noindex, (?:no)?follow"/.test(html)) throw new Error(`Test Pages build must be noindex: ${name}`)
  if (isGitHubPagesProject && /(?:src|href|srcset|poster)=["']\/(?:_next|images|videos|favicon|icon|apple-touch)/i.test(html)) throw new Error(`Unprefixed root asset in test Pages HTML: ${name}`)
  if (isGitHubPagesProject) {
    const rootUrls = [...html.matchAll(/(?:href|src|srcset|poster)=["'](\/(?!\/)[^"']*)["']/gi)].map((match) => match[1])
    const missingBase = rootUrls.find((url) => url !== basePath && !url.startsWith(`${basePath}/`) && !url.startsWith('/#'))
    if (missingBase) throw new Error(`Unprefixed root path ${missingBase} in test Pages HTML: ${name}`)
  }
  if (/Заявка отправлена\./u.test(html)) throw new Error(`False submission confirmation: ${name}`)
  if (/<(?:script|iframe)[^>]+src=["']https?:\/\/|<link[^>]+rel=["'](?:preconnect|dns-prefetch)["'][^>]+href=["']https?:\/\//i.test(html)) throw new Error(`Automatic external resource: ${name}`)
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
fs.writeFileSync(path.join(root, 'release.json'), JSON.stringify({ profile: 'visual-contacts', sha, basePath, onlineLeads: false, analytics: false, weather: 'disabled', weatherTransport: 'none', embeddedYandex: false, promotionalOffer: true }) + '\n')
console.log(`Owner acceptance export PASS: ${htmlFiles.length} HTML, contacts only, weather UI and snapshots disabled, city component/source data retained in the repository for redesign, desktop offer retained; browser and legal acceptance required separately`)
