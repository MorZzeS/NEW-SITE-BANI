import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
function load(file, env, requireModule, scope={}) {
 const exports={}; const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText
 vm.runInNewContext(source,{exports,process:{env},URL,require:requireModule,...scope}); return exports
}
const legacy=load('src/lib/lead-consent.ts',{})
assert.equal(legacy.leadContract,1);assert.deepEqual(JSON.parse(JSON.stringify(legacy.consentEvidence())),{})
const pending=load('src/lib/lead-consent.ts',{NEXT_PUBLIC_LEADS_CONTRACT:'2'})
assert.equal(pending.consentEvidenceReady,false)
const approved=load('src/lib/lead-consent.ts',{NEXT_PUBLIC_LEADS_CONTRACT:'2',NEXT_PUBLIC_CONSENT_VERSION:'synthetic-consent-v1',NEXT_PUBLIC_POLICY_VERSION:'synthetic-policy-v1'})
assert.equal(approved.leadPageUrl('https://test.invalid/model?phone=private#anchor'),'https://test.invalid/model')
assert.equal(approved.consentEvidence().contractVersion,2)
let calls=0
const http=load('src/lib/leads.ts',{NEXT_PUBLIC_LEADS_ENDPOINT:'https://test.invalid/leads'},()=>legacy,{location:{protocol:'http:'},fetch:()=>{calls++}})
await assert.rejects(()=>http.sendLead({}),/HTTP/);assert.equal(calls,0)
const missing=load('src/lib/leads.ts',{NEXT_PUBLIC_LEADS_ENDPOINT:'https://test.invalid/leads'},()=>pending,{location:{protocol:'https:'},fetch:()=>{calls++}})
await assert.rejects(()=>missing.sendLead({}),/утверждены/);assert.equal(calls,0)
const ok=load('src/lib/leads.ts',{NEXT_PUBLIC_LEADS_ENDPOINT:'https://test.invalid/leads'},()=>approved,{location:{protocol:'https:'},AbortController,setTimeout,clearTimeout,fetch:async(_,options)=>{calls++;assert.equal(options.credentials,'omit');return {ok:true,json:async()=>({ok:true,requestId:'synthetic-request'})}}})
await ok.sendLead({requestId:'synthetic-request',...approved.consentEvidence()});assert.equal(calls,1)
console.log('PASS: legacy contract unchanged, v2 pending failclosed, approved synthetic evidence, URL minimization, HTTP blocked before fetch, matching receipt. No real network.')
