import fs from 'node:fs'
import path from 'node:path'

const isGitHubPagesProject = process.env.BANGER_GITHUB_PAGES === 'true'
const root = path.resolve(process.argv[2] || (isGitHubPagesProject ? 'dist-pages' : 'dist'))

if (!fs.existsSync(path.join(root, 'index.html'))) {
  throw new Error(`Static export is missing index.html: ${root}`)
}

const files = []
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(absolute)
    else if (entry.isFile()) files.push(absolute)
  }
}
walk(root)

const releasePath = path.join(root, 'release.json')
const release = fs.existsSync(releasePath) ? JSON.parse(fs.readFileSync(releasePath, 'utf8')) : {}
const basePath = typeof release.basePath === 'string' ? release.basePath.replace(/\/$/, '') : ''
const missing = []
const checked = new Set()

function resolveReference(reference, sourceFile) {
  const clean = reference.split(/[?#]/, 1)[0]
  if (!clean || /^(?:data:|https?:|\/\/|#)/i.test(clean)) return

  let decoded
  try { decoded = decodeURIComponent(clean) } catch { decoded = clean }

  let target
  if (decoded.startsWith('/')) {
    let relative = decoded
    if (basePath && (relative === basePath || relative.startsWith(`${basePath}/`))) {
      relative = relative.slice(basePath.length) || '/'
    }
    target = path.resolve(root, `.${relative}`)
  } else {
    target = path.resolve(path.dirname(sourceFile), decoded)
  }

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    missing.push({ source: path.relative(root, sourceFile).replaceAll('\\', '/'), reference, reason: 'outside export root' })
    return
  }

  const key = path.relative(root, target)
  if (checked.has(key)) return
  checked.add(key)
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    missing.push({ source: path.relative(root, sourceFile).replaceAll('\\', '/'), reference, target: path.relative(root, target).replaceAll('\\', '/') })
  }
}

for (const htmlFile of files.filter((file) => file.endsWith('.html'))) {
  const html = fs.readFileSync(htmlFile, 'utf8')
  for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    resolveReference(match[1], htmlFile)
  }
  for (const match of html.matchAll(/<link\b([^>]*?)>/gi)) {
    const tag = match[0]
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1] || ''
    if (!/\b(?:stylesheet|preload|modulepreload)\b/i.test(rel)) continue
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
    if (href) resolveReference(href, htmlFile)
  }
}

for (const cssFile of files.filter((file) => file.endsWith('.css'))) {
  const css = fs.readFileSync(cssFile, 'utf8')
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    resolveReference(match[1], cssFile)
  }
}

const result = {
  root,
  htmlFiles: files.filter((file) => file.endsWith('.html')).length,
  cssFiles: files.filter((file) => file.endsWith('.css')).length,
  checkedReferences: checked.size,
  missing,
}
console.log(JSON.stringify(result, null, 2))
if (missing.length) process.exitCode = 1
