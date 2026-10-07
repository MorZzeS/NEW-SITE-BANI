import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const config = require('../next.config.js')
const errors = []
let files = 0
if (config.basePath || config.assetPrefix) errors.push('Production config must serve from the domain root')
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) scan(file)
    else if (/\.(?:html|css|js|ts|tsx|xml|txt)$/.test(entry.name)) {
      files++
      const text = fs.readFileSync(file, 'utf8')
      if (/NEW-SITE-BANI|morzzes\.github\.io/.test(text)) errors.push(`${file}: legacy staging path`)
      if (dir.startsWith(config.distDir) && entry.name.endsWith('.css')) {
        for (const match of text.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)) {
          const url = match[2]
          if (/^(data:|https?:|#)/.test(url)) continue
          const target = url.startsWith('/') ? path.join(config.distDir, url) : path.resolve(path.dirname(file), url)
          if (!fs.existsSync(target.split(/[?#]/)[0])) errors.push(`${file}: missing CSS resource ${url}`)
        }
      }
    }
  }
}
scan('src')
scan(config.distDir)
console.log(JSON.stringify({ productionPathAudit: errors.length ? 'FAIL' : 'PASS', files, errors }, null, 2))
if (errors.length) process.exitCode = 1
