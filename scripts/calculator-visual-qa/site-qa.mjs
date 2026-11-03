import fs from 'node:fs'
import path from 'node:path'
import { Cdp, browserWs, writeBase64, sleep } from './cdp.mjs'

// Requires an already authorized, running CDP browser. Does not launch Chrome.
const base = process.argv[2] || 'http://127.0.0.1:4319'
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local test server required')
const out = path.resolve('docs/calculator-visual-2026-11-02/site-qa')
fs.mkdirSync(out, { recursive: true })
const report = { startedAt: new Date().toISOString(), base, status: 'running', cases: [], limitation: 'Screenshots require manual review. No forms submitted. Model pages excluded.' }
let cdp, targetId
try {
  const browser = await browserWs(Number(process.argv[3] || 9333))
  cdp = new Cdp(browser.webSocketDebuggerUrl)
  await cdp.connect()
  ;({ targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' }))
  await cdp.attachPage(targetId)
  for (const domain of ['Page', 'Runtime', 'Log', 'Network']) await cdp.send(`${domain}.enable`)
  let errors = []
  cdp.on('Runtime.exceptionThrown', p => errors.push({ type: 'exception', detail: p.exceptionDetails }))
  cdp.on('Runtime.consoleAPICalled', p => { if (p.type === 'error') errors.push({ type: 'console', detail: p.args }) })
  cdp.on('Log.entryAdded', p => { if (p.entry.level === 'error') errors.push({ type: 'log', detail: p.entry }) })
  cdp.on('Network.responseReceived', p => { if (p.response.status >= 400) errors.push({ type: 'http', status: p.response.status, url: p.response.url }) })
  cdp.on('Network.loadingFailed', p => { if (!p.canceled) errors.push({ type: 'network', detail: p.errorText }) })
  const evaluate = async expression => {
    const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
    return r.result.value
  }
  const capture = async name => {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    writeBase64(path.join(out, `${name}.png`), data)
  }
  const routes = ['/', '/katalog/', '/katalog/bani/', '/katalog/doma/', '/poleznoe/', '/o-kompanii/', '/kontakty/', '/nashi-raboty/']
  for (const route of routes) for (const width of [1440, 768, 390]) for (const theme of ['dark', 'light']) {
    errors = []
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 })
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] })
    const load = cdp.waitForLoad()
    await cdp.send('Page.navigate', { url: base + route })
    await load
    await sleep(1000)
    await evaluate(`document.documentElement.dataset.theme === ${JSON.stringify(theme)} || document.querySelector('button.theme-toggle')?.click()`)
    await sleep(300)
    // Load lazy images throughout page before measuring and capturing.
    await evaluate(`(async () => { for (let y=0; y<document.documentElement.scrollHeight; y+=800) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,80)); } window.scrollTo(0,0); await document.fonts.ready; })()`)
    await sleep(500)
    const state = await evaluate(`({ title: document.title, h1: [...document.querySelectorAll('h1')].map(e=>e.textContent), theme: document.documentElement.dataset.theme, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(i=>i.complete && !i.naturalWidth && i.getAttribute('src')).map(i=>i.getAttribute('src')) })`)
    const name = `${route.replaceAll('/', '_') || 'home'}-${width}-${theme}`
    await capture(name)
    const item = { route, width, theme, state, errors: [...errors], screenshot: `${name}.png`, overflow: state.scrollWidth > state.width, menu: null }
    if (width < 1000) {
      const opened = await evaluate(`(() => { const b=document.querySelector('button[aria-label="Открыть меню"]'); if (!b || !b.getClientRects().length) return false; b.click(); return true; })()`)
      if (opened) {
        await sleep(300)
        item.menu = await evaluate(`({ visible: !!document.querySelector('nav[aria-label="Мобильная навигация"]'), expanded: document.querySelector('.header-menu-trigger')?.getAttribute('aria-expanded'), scrollWidth: document.documentElement.scrollWidth, links: [...document.querySelectorAll('nav[aria-label="Мобильная навигация"] a')].map(a=>a.getAttribute('href')) })`)
        await capture(`${name}-menu`)
        await evaluate(`document.querySelector('nav[aria-label="Мобильная навигация"] button[aria-label="Закрыть меню"]')?.click()`)
        await sleep(300)
        item.menu.closed = await evaluate(`!document.querySelector('nav[aria-label="Мобильная навигация"]')`)
      }
    }
    report.cases.push(item)
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2))
  }
  report.status = 'captured-needs-visual-review'
} catch (error) {
  report.status = 'blocked'
  report.error = String(error)
  process.exitCode = 1
} finally {
  if (cdp && targetId) await cdp.send('Target.closeTarget', { targetId }, undefined).catch(() => {})
  cdp?.close()
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2))
}
