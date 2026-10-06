import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
import QRCode from 'qrcode'
const compile = file => ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const data = {}, social = {}
vm.runInNewContext(compile('src/data/index.ts'), { exports: data })
vm.runInNewContext(compile('src/data/social.ts'), { exports: social, require: id => { if (id === '@/data') return data; throw new Error(`Unexpected import ${id}`) } })
fs.mkdirSync('public/images/social', { recursive: true })
let count = 0
for (const item of social.socialLinks) {
  if (!item.url) continue
  if (!/^https:\/\//.test(item.url) || !/^[a-z]+$/.test(item.id)) throw new Error(`Invalid social configuration: ${item.id}`)
  await fs.promises.writeFile(path.join('public/images/social', `${item.id}-qr.svg`), await QRCode.toString(item.url, { type: 'svg', margin: 4, errorCorrectionLevel: 'M' }))
  count++
}
console.log(`PASS: ${count} social QR codes generated from configured real URLs; missing URLs skipped.`)
