import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { webcrypto } from 'node:crypto'
function load(file, imports, globals={}) {
 const module={exports:{}}
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
 vm.runInNewContext(code,{module,exports:module.exports,require:name=>{if(!(name in imports))throw Error(name);return imports[name]},URL,TextEncoder,TextDecoder,AbortController,setTimeout,clearTimeout,console,...globals},{filename:file})
 return module.exports
}
const context=load('src/lib/lead-context.ts',{})
test('model, home, configurator, consultation and bath-only promotion context',()=>{
 const baths=[{name:'Исток 4',article:'БГ-01',slug:'istok-4'}],houses=[{name:'Дом',article:'Д-01',slug:'dom'}]
 const get=(url,name)=>context.resolveLeadContext(url,name,baths,houses)
 assert.equal(get('https://banger.su/banya/istok-4?utm_source=test','Исток 4').article,'БГ-01')
 assert.equal(get('https://banger.su/banya/istok-4?utm_source=test','Исток 4').page,'https://banger.su/banya/istok-4')
 assert.equal(get('https://banger.su/').source,'Получить консультацию')
 assert.equal(get('https://banger.su/komplektaciya?model=Исток%204').source,'Конфигуратор')
 const offer=get('https://banger.su/kontakty?source=exit-intent&from=/')
 assert.equal(offer.promotion,'Скидка 15 000 ₽');assert.equal(offer.modelKind,'bath');assert.equal(offer.page,'https://banger.su/')
 assert.equal(get('https://banger.su/kontakty?source=exit-intent&model=Дом').promotion,'')
 assert.equal(get('https://banger.su/kontakty?source=exit-intent&from=/banya/istok-4').article,'БГ-01')
 assert.equal(get('https://banger.su/kontakty?source=exit-intent&from=/dom/dom').promotion,'')
 assert.equal(get('https://banger.su/kontakty?source=exit-intent&from=//evil.test').page,'https://banger.su/kontakty')
})
const evidence={contractVersion:3,purposeCode:'inquiry_response',action:'unchecked_checkbox_then_submit',consentVersion:'test',policyVersion:'test',checkboxVersion:'test',consentTextSha256:'a'.repeat(64),checkboxTextSha256:'b'.repeat(64),policyTextSha256:'c'.repeat(64)}
const candidate={...evidence,requestId:'12345678-1234-4234-8234-123456789012',name:'Тест',phone:'+79000000000',model:'Исток 4',page:'https://banger.su/banya/istok-4',comment:'synthetic',createdAt:new Date().toISOString(),consent:true,website:'',startedAt:Date.now()-5000,source:'Карточка модели',article:'БГ-01',configuration:'',promotion:'',modelKind:'bath'}
function setup(reply, enabled=true) {
 const storage=new Map();const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}
 const attempts=load('src/lib/lead-attempt.ts',{}, {window:{},sessionStorage})
 let calls=0
 const client=load('src/lib/leads.ts',{'./lead-consent':{leadContract:3,consentEvidenceReady:true,verifyLeadDocumentBundle:async()=>({}),consentEvidence:()=>evidence},'./lead-attempt':attempts,'./release-policy':{releasePolicy:{onlineLeads:enabled}}},{location:{protocol:'https:'},process:{env:{NEXT_PUBLIC_LEADS_ENDPOINT:'https://synthetic.invalid/leads'}},crypto:webcrypto,fetch:async()=>{calls++; return reply(calls)}})
 return {client,attempts,calls:()=>calls}
}
function ack(status='accepted') {
 const {checkboxVersion,...fields}=evidence
 return {ok:true,...{contractVersion:3,requestId:candidate.requestId,status,admitted:true,retryable:false},receipt:{...fields,receiptId:'abcdef12-1234-4234-8234-123456789012',requestId:candidate.requestId,receivedAt:new Date().toISOString(),consent:true,page:candidate.page}}
}
const response=(body,status)=>({status,ok:status>=200&&status<300,json:async()=>body})
test('durable acceptance is separate from delivery and locks repeat',async()=>{
 const s=setup(()=>response(ack(),202)); const result=await s.client.sendLead(candidate)
 assert.equal(result.status,'accepted');assert.equal(s.attempts.leadAttemptMarker().state,'accepted')
 await assert.rejects(()=>s.client.sendLead(candidate));assert.equal(s.calls(),1)
})
test('malformed receipt never reports success',async()=>{
 const body=ack();body.receipt.page='https://banger.su/wrong'
 const s=setup(()=>response(body,202));await assert.rejects(()=>s.client.sendLead(candidate));assert.equal(s.attempts.leadAttemptMarker().state,'unknown')
})
test('proven storage rollback allows same-ID retry, then accepted',async()=>{
 const s=setup(n=>n===1?response({ok:false,contractVersion:3,requestId:candidate.requestId,status:'storage_unavailable',admitted:false,retryable:true},503):response(ack(),202))
 await assert.rejects(()=>s.client.sendLead(candidate),e=>e.retryable===true)
 assert.equal(s.attempts.leadAttemptMarker(),undefined)
 assert.equal((await s.client.sendLead({...candidate,createdAt:new Date().toISOString()})).status,'accepted')
})
test('production disabled flag prevents all network calls',async()=>{
 const s=setup(()=>{throw Error('must not run')},false);await assert.rejects(()=>s.client.sendLead(candidate));assert.equal(s.calls(),0)
})
