import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'

const exports = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/theme.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports })

// Execute the actual pre-paint script with first-visit, persisted, invalid and
// blocked-storage browser states. An unavailable store must not force DARK.
for (const preferred of ['dark', 'light']) {
  for (const saved of [null, 'dark', 'light', 'invalid', '']) {
    let applied
    vm.runInNewContext(exports.themeScript, {
      window: { matchMedia: () => ({ matches: preferred === 'light' }) },
      localStorage: { getItem: () => saved },
      document: { documentElement: { setAttribute: (name, value) => { applied = value } } },
    })
    assert.equal(applied, saved === 'dark' || saved === 'light' ? saved : preferred)
  }
  let applied
  vm.runInNewContext(exports.themeScript, {
    window: { matchMedia: () => ({ matches: preferred === 'light' }) },
    localStorage: { getItem: () => { throw new Error('storage blocked') } },
    document: { documentElement: { setAttribute: (name, value) => { applied = value } } },
  })
  assert.equal(applied, preferred)
}
const html = fs.readFileSync('dist/index.html', 'utf8')
assert.ok(html.indexOf(exports.themeScript) > 0)
assert.ok(html.indexOf(exports.themeScript) < html.indexOf('</head>'))
assert.ok(html.includes('role="switch"') && html.includes('aria-checked="false"'))
console.log('PASS: 12 pre-paint initialization cases; exported head script and accessible theme switch.')
