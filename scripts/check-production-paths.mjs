import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const config = require('../next.config.js')
const isGitHubPagesTest = process.env.BANGER_GITHUB_PAGES === 'true'
const expectedBasePath = isGitHubPagesTest ? '/NEW-SITE-BANI' : ''
const errors = []
let files = 0
if (isGitHubPagesTest ? config.basePath !== expectedBasePath : Boolean(config.basePath || config.assetPrefix)) {
  errors.push(isGitHubPagesTest ? `Test Pages config must use ${expectedBasePath}` : 'Production config must serve from the domain root')
}
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) scan(file)
    else if (/\.(?:html|css|js|ts|tsx|xml|txt)$/.test(entry.name)) {
      files++
      const text = fs.readFileSync(file, 'utf8')
      let withoutExpectedPrefix = isGitHubPagesTest ? text.replaceAll(expectedBasePath, '') : text
      if (!isGitHubPagesTest && file.replaceAll('\\', '/') === 'src/app/layout.tsx') {
        // This source-only condition controls test build metadata; a root
        // production export must still contain no test deployment path.
        withoutExpectedPrefix = text.replace("const isGitHubPagesProject = basePath === '/NEW-SITE-BANI'", '')
      }
      if (/NEW-SITE-BANI|morzzes\.github\.io/.test(withoutExpectedPrefix)) errors.push(`${file}: legacy staging path`)
      if (dir.startsWith(config.distDir) && entry.name.endsWith('.css')) {
        for (const match of text.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)) {
          const url = match[2]
          if (/^(data:|https?:|#)/.test(url)) continue
          const localUrl = isGitHubPagesTest && url.startsWith(`${expectedBasePath}/`) ? url.slice(expectedBasePath.length) : url
          const target = localUrl.startsWith('/') ? path.join(config.distDir, localUrl.slice(1)) : path.resolve(path.dirname(file), localUrl)
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
