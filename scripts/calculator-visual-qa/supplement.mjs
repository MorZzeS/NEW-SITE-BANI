import fs from 'node:fs'
import path from 'node:path'
import { Cdp, browserWs, sleep, writeBase64 } from './cdp.mjs'
const base = process.argv[2] || 'http://127.0.0.1:4318/NEW-SITE-BANI'
const out = path.resolve('docs/calculator-visual-2026-11-02')
const browser = await browserWs(Number(process.argv[3] || 9333))
const cdp = new Cdp(browser.webSocketDebuggerUrl)
await cdp.connect()
const {targetId} = await cdp.send('Target.createTarget', {url:'about:blank'})
await cdp.attachPage(targetId)
await cdp.send('Page.enable')
await cdp.send('Runtime.enable')
const evaluate = async expression => {
 const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})
 if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails))
 return r.result.value
}
const results={startedAt:new Date().toISOString(),variants:[],failures:[],handoff:[]}
const check=(ok,label)=>{if(!ok)results.failures.push(label)}
try {
 for(const route of ['/komplektaciya','/banya/istok-4']) {
  const load=cdp.waitForLoad(); await cdp.send('Page.navigate',{url:base+route});await load;await sleep(800)
  for(const width of [1440,768,390])for(const theme of ['light','dark']) {
   await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600})
   await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]})
   await evaluate(`document.querySelector('[data-model-option-calculator],#equipment-options')?.scrollIntoView()`)
   await sleep(250)
   const state=await evaluate(`(()=>{const summaries=[...document.querySelectorAll('[class*="optionCategory"]>summary,[class*="statusSection"]>summary')];const rows=[...document.querySelectorAll('[data-option-id]')];return {overflow:document.documentElement.scrollWidth>innerWidth+1,duplicateMarkers:summaries.filter(s=>!['none','normal','""'].includes(getComputedStyle(s,'::after').content)).length,rows:rows.length,checkboxes:document.querySelectorAll('[data-option-id] input').length}})()`)
   check(!state.overflow,route+' overflow '+width+' '+theme)
   check(state.duplicateMarkers===0,route+' duplicate marker '+width+' '+theme)
   results.variants.push({route,width,theme,...state})
   const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
   writeBase64(path.join(out,'screenshots',`${route.includes('komplektaciya')?'equipment':'fixed-bg01'}-${width}-${theme}.png`),shot.data)
  }
  const handoff=await evaluate(`(async()=>{const input=[...document.querySelectorAll('[data-option-id] input')].find(n=>n.getClientRects().length);if(!input)return {error:'no visible option'};input.focus();const focus=getComputedStyle(input.nextElementSibling).outlineStyle;input.click();await new Promise(r=>setTimeout(r,80));const selected=document.querySelector('[data-estimated-total],[data-additional-total]');const before={count:Number(selected?.dataset.selectedCount),sum:Number(selected?.dataset.knownOptionsTotal||selected?.dataset.additionalTotal)};const button=document.querySelector('[data-calculator-request]')||[...document.querySelectorAll('button')].find(n=>n.textContent.includes('Получить расчёт с выбранными опциями'));button?.click();await new Promise(r=>setTimeout(r,80));return {focus,before,comment:document.querySelector('textarea')?.value||'',active:document.activeElement?.tagName,requestButton:!!button}})()`)
  check(handoff.before?.count===1,route+' selection failed')
  check(handoff.requestButton,route+' handoff button missing')
  check(Boolean(handoff.comment),route+' handoff comment empty')
  results.handoff.push({route,...handoff})
  await evaluate(`(document.querySelector('[data-calculator-reset]')||[...document.querySelectorAll('button')].find(n=>n.textContent.includes('Сбросить выбор')))?.click()`)
  await sleep(80)
  check(await evaluate(`Number(document.querySelector('[data-estimated-total],[data-additional-total]')?.dataset.selectedCount)===0`),route+' reset failed')
 }
} finally {
 results.finishedAt=new Date().toISOString()
 fs.writeFileSync(path.join(out,'supplement-results.json'),JSON.stringify(results,null,2))
 await cdp.send('Target.closeTarget',{targetId}).catch(()=>{})
 cdp.close()
}
console.log(JSON.stringify(results,null,2))
process.exitCode=results.failures.length?1:0
