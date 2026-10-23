import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve('dist')
const files = fs.readdirSync(root, { recursive: true }).filter(name => fs.statSync(path.join(root, name)).isFile())
const htmlFiles = files.filter(name => name.endsWith('.html'))
if (!htmlFiles.length) throw new Error('Visual release export is missing')
const policy = fs.readFileSync('src/lib/release-policy.ts', 'utf8')
for (const flag of ['onlineLeads', 'analytics', 'weather', 'embeddedYandex', 'promotionalOffer']) {
  if (!new RegExp(`\\b${flag}:\\s*false\\b`).test(policy)) throw new Error(`Unsafe release policy: ${flag}`)
}
for (const name of files) {
  const normalized = name.replaceAll('\\', '/')
  if (/(^|\/)(?:docs|backend|node_modules|\.git)(\/|$)|(^|\/)\.env(?:\.|$)|\.map$/i.test(normalized)) throw new Error(`Private deployment file: ${name}`)
  if (!/\.(?:html|js|json|txt|xml|svg)$/i.test(name)) continue
  const content = fs.readFileSync(path.join(root, name), 'utf8')
  if (/(?:MAX_BOT_TOKEN|MAX_USER_ID|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(content)) throw new Error(`Unexpected server-only material: ${name}`)
  if (/mc\.yandex\.(?:ru|com)\/|api\.met\.no\/|api\.open-meteo\.com\/|banger-leads\.onrender\.com|platform-api2\.max\.ru/.test(content)) throw new Error(`Disabled service shipped: ${name}`)
}
for (const name of htmlFiles) {
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (/<form\b|<iframe\b/i.test(html)) throw new Error(`Unexpected collection or embed surface: ${name}`)
  const catalogRedirect = name === 'katalog.html' && html.includes('NEXT_REDIRECT;replace;/katalog/bani;307;') && html.includes('href="https://banger.su/katalog/bani"')
  if (!html.includes('data-release-profile="visual-contacts"') && !catalogRedirect) throw new Error(`Wrong release profile: ${name}`)
  if (/скидку 25\s*000|Получить предложение|Заявка отправлена\./u.test(html)) throw new Error(`Inactive offer or submission copy: ${name}`)
  if (/(?:MAX_BOT_TOKEN|MAX_USER_ID|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(html)) throw new Error(`Unexpected server-only material: ${name}`)
}
for (const route of ['privacy', 'politika', 'cookie', 'soglasie-pd', 'soglasie-reklama']) {
  const name = htmlFiles.find(name => name === `${route}.html` || name === `${route}/index.html`)
  if (!name) throw new Error(`Missing information route: ${route}`)
  const html = fs.readFileSync(path.join(root, name), 'utf8')
  if (/не передаются третьим|база.*на территории РФ|требует проверки владельцем|черновик/iu.test(html)) throw new Error(`Unapproved legal assertion: ${route}`)
}
const sha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Invalid public release SHA')
fs.writeFileSync(path.join(root, 'release.json'), JSON.stringify({ profile: 'visual-contacts', sha, onlineLeads: false, analytics: false, weather: false, embeddedYandex: false, promotionalOffer: false }) + '\n')
console.log(`Visual contacts release PASS: ${htmlFiles.length} HTML, no forms/iframes, public release manifest written`)
