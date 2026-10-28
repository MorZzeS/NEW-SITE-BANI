import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync,writeFileSync,rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { DurableStore,hash } from './durable-store.mjs'
import { createDurableServer,createMaxNotifier } from './durable-server.mjs'
const origin='https://example.test'
function fixture(t) {
  const dir=mkdtempSync(join(tmpdir(),'durable-synthetic-'))
  const documents=Object.fromEntries(['consent','checkbox','policy'].map(kind=>[kind,{version:'SYNTHETIC-'+kind,text:'SYNTHETIC ONLY '+kind,sha256:hash('SYNTHETIC ONLY '+kind)}]))
  const bundlePath=join(dir,'documents.json'); writeFileSync(bundlePath,JSON.stringify({approved:true,documents}))
  const options={path:join(dir,'leads.sqlite'),bundlePath}
  let store=new DurableStore(options); t.after(()=>{try{store.close()}catch{}; rmSync(dir,{recursive:true,force:true})})
  const lead={contractVersion:3,requestId:'synthetic-request-001',name:'Синтетика',phone:'+79990000000',model:'Баня',comment:'',page:origin+'/test',createdAt:new Date().toISOString(),consent:true,website:'',startedAt:Date.now()-5000,purposeCode:'inquiry_response',action:'unchecked_checkbox_then_submit',source:'Exit-intent',article:'T1',configuration:'Тест',promotion:'Скидка 15 000 ₽',modelKind:'bath'}
  for(const [kind,doc] of Object.entries(documents)){lead[kind+'Version']=doc.version;lead[kind+'TextSha256']=doc.sha256}
  return {dir,options,lead,get store(){return store},restart(){store.close();store=new DurableStore(options);return store}}
}
test('atomic admission, exact receipt, durable restart dedup and conflict',t=>{
  const f=fixture(t), accepted=f.store.admit(f.lead,origin,'ip')
  assert.equal(accepted.http,202);assert.equal(accepted.body.admitted,true)
  assert.equal(Object.keys(accepted.body.receipt).length,13);assert.equal('checkboxVersion' in accepted.body.receipt,false)
  assert.deepEqual(f.restart().admit(f.lead,origin,'ip'),accepted)
  assert.equal(f.store.admit({...f.lead,name:'Другой'},origin,'ip').http,409)
  assert.equal(f.store.db.prepare('SELECT count(*) n FROM outbox').get().n,1)
  assert.throws(()=>f.store.db.exec("UPDATE documents SET text='changed'"),/immutable/)
})
test('consent, source, promotion and origin rejected before admission',t=>{
 const f=fixture(t)
 for(const change of [{consent:false},{consentVersion:'wrong'},{checkboxTextSha256:'bad'},{source:'bad'},{article:'x'.repeat(81)},{modelKind:'house'}, {configuration:undefined}]) assert.equal(f.store.admit({...f.lead,...change},origin,'ip').http,400)
 assert.equal(f.store.admit(f.lead,'https://other.test','ip').http,400)
 assert.equal(f.store.db.prepare('SELECT count(*) n FROM leads').get().n,0)
})
test('rate persists and duplicate bypasses limit',t=>{
 const f=fixture(t)
 for(let i=0;i<5;i++) assert.equal(f.store.admit({...f.lead,requestId:'synthetic-request-00'+i},origin,'ip').http,202)
 f.restart();assert.equal(f.store.admit({...f.lead,requestId:'synthetic-request-009'},origin,'ip').http,429)
 assert.equal(f.store.admit(f.lead,origin,'ip').http,202)
})
test('rollback proves rejection; postcommit failure is unknown admission',t=>{
 const f=fixture(t);f.store.fault=()=>{throw new Error('disk')}
 assert.equal(f.store.admit(f.lead,origin,'ip').body.status,'storage_unavailable')
 assert.equal(f.store.db.prepare('SELECT count(*) n FROM leads').get().n,0)
 f.store.fault=point=>{if(point==='after_commit')throw new Error('lost ack')}
 assert.equal(f.store.admit(f.lead,origin,'ip').body.admitted,null)
 assert.equal(f.restart().admit(f.lead,origin,'ip').http,202)
})
test('outbox confirmed send; 429 retries only; timeout and restart claims unknown',async t=>{
 const f=fixture(t);f.store.admit(f.lead,origin,'ip')
 await f.store.work(async()=>({status:'retry429',retryAfterMs:1000}))
 assert.equal(f.store.admit(f.lead,origin,'ip').http,202)
 f.store.db.exec('UPDATE outbox SET due=0')
 await f.store.work(async()=>({status:'sent',messageId:'synthetic-mid'}));assert.equal(f.store.admit(f.lead,origin,'ip').http,200)
 const second={...f.lead,requestId:'synthetic-request-002'};f.store.admit(second,origin,'ip')
 await f.store.work(()=>new Promise(()=>{}),5)
 assert.equal(f.store.admit(second,origin,'ip').body.status,'unknown')
 let calls=0;await f.store.work(async()=>{calls++;return {status:'sent',messageId:'synthetic-mid'}});assert.equal(calls,0)
 f.store.db.exec("UPDATE outbox SET status='claimed' WHERE id='synthetic-request-002'")
 assert.equal(f.restart().admit(second,origin,'ip').body.status,'unknown')
})
test('synthetic secure backup/restore drill preserves receipt and checksum',async t=>{
 const f=fixture(t),original=f.store.admit(f.lead,origin,'ip'),destination=join(f.dir,'backup.sqlite')
 const checksum=await f.store.backupTo(destination),restored=join(f.dir,'restored.sqlite')
 execFileSync(process.execPath,['backend/durable-backup.mjs','restore',destination,restored,checksum])
 const db=new DurableStore({...f.options,path:restored});try{assert.deepEqual(db.admit(f.lead,origin,'ip').body.receipt,original.body.receipt);assert.equal(db.admit(f.lead,origin,'ip').body.status,'unknown')}finally{db.close()}
 assert.throws(()=>execFileSync(process.execPath,['backend/durable-backup.mjs','restore',destination,join(f.dir,'bad.sqlite'),'0'.repeat(64)],{stdio:'pipe'}))
})
test('default gate and test MAX recipient never falls back to production',async()=>{
 assert.throws(()=>createDurableServer({env:{}}),/disabled/)
 assert.throws(()=>createMaxNotifier({TEST_MODE:'1',MAX_BOT_TOKEN:'synthetic',MAX_USER_ID:'123'}),/recipient/)
 let target
 const notify=createMaxNotifier({TEST_MODE:'1',TEST_MAX_USER_ID:'456',MAX_USER_ID:'123',MAX_BOT_TOKEN:'synthetic'},async url=>{target=url;return {ok:true,status:200,json:async()=>({message:{body:{mid:'synthetic'}}})}})
 assert.equal((await notify({})).status,'sent');assert.equal(target.searchParams.get('user_id'),'456')
})




test('strict MAX acknowledgement, server timestamp and persisted message ID',async t=>{
 const f=fixture(t);const receipt=f.store.admit(f.lead,origin,'ip').body.receipt
 let sentBody
 const notifier=createMaxNotifier({MAX_USER_ID:'123',MAX_BOT_TOKEN:'synthetic'},async(url,opts)=>{sentBody=JSON.parse(opts.body);return {status:200,json:async()=>({message:{body:{mid:'confirmed-mid'}}})}})
 await f.store.work(notifier)
 assert.match(receipt.receivedAt,/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);assert.ok(sentBody.text.includes('Принято сервером: '+receipt.receivedAt));assert.equal(f.store.db.prepare('SELECT message_id FROM outbox').get().message_id,'confirmed-mid')
 for(const [status,message] of [[201,{body:{mid:'id'}}],[200,{}],[200,{body:{mid:''}}]]) {
  const notify=createMaxNotifier({MAX_USER_ID:'123',MAX_BOT_TOKEN:'synthetic'},async()=>({status,json:async()=>({message})}))
  assert.equal((await notify({})).status,'unknown')
 }
})
test('old duplicate keeps its receipt; control chars and URL tracking are rejected',t=>{
 const f=fixture(t),original=f.store.admit(f.lead,origin,'ip')
 f.store.now=()=>Date.now()+172800000
 assert.deepEqual(f.store.admit(f.lead,origin,'ip'),original)
 f.store.now=Date.now
 for(const changes of [{page:origin+'/?utm=test'},{page:origin+'/#test'},{name:'Test\nInjected'},{source:'Контакты'}]) assert.equal(f.store.admit({...f.lead,requestId:'synthetic-request-002',...changes},origin,'ip').http,400)
})
test('HTTP accepts exact schema; trusted loopback uses validated real IP and durable HMAC rate key',async t=>{
 const f=fixture(t);f.store.close()
 const env={DURABLE_LEADS_ENABLED:'1',SYNTHETIC_ONLY:'1',LEADS_DB_PATH:f.options.path,LEAD_DOCUMENT_BUNDLE:f.options.bundlePath,ALLOWED_ORIGINS:origin,TRUST_LOOPBACK_PROXY:'1',RATE_HMAC_KEY:'synthetic-key-for-test-only-123456789'}
 const {server,store}=createDurableServer({env,notifier:async()=>({status:'sent',messageId:'synthetic'})})
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 try {
  const url=`http://127.0.0.1:${server.address().port}/leads`
  const send=(ip,lead)=>fetch(url,{method:'POST',headers:{origin,'content-type':'application/json','x-real-ip':ip},body:JSON.stringify(lead)})
  assert.equal((await send('invalid',f.lead)).status,400)
  for(let i=0;i<5;i++) assert.equal((await send('192.0.2.1',{...f.lead,requestId:'synthetic-http-00'+i})).status,202)
  assert.equal((await send('192.0.2.1',{...f.lead,requestId:'synthetic-http-009'})).status,429)
  assert.equal((await send('192.0.2.2',{...f.lead,requestId:'synthetic-http-010'})).status,202)
  const rows=store.db.prepare('SELECT key FROM rates').all();assert.equal(rows.length,2);assert.ok(rows.every(row=>row.key !== hash('192.0.2.1')))
 } finally {await new Promise(resolve=>server.close(resolve))}
})


test('multiline comment and configuration preserve LF CR tab; other control characters rejected',t=>{
 const f=fixture(t)
 const lead={...f.lead,comment:'Первая строка\nВторая\r\n\tОтступ',configuration:'Размер: 6 м\r\nКомплектация:\n\tТест'}
 assert.equal(f.store.admit(lead,origin,'ip').http,202)
 const persisted=JSON.parse(f.store.db.prepare('SELECT payload FROM leads WHERE id=?').get(lead.requestId).payload)
 assert.equal(persisted.comment,lead.comment);assert.equal(persisted.configuration,lead.configuration)
 assert.equal(f.store.db.prepare('SELECT count(*) n FROM documents').get().n,3)
 for(const field of ['comment','configuration']) for(const character of ['\u0000','\u0008','\u000b','\u000c','\u001b','\u001f','\u007f']) {
  assert.equal(f.store.admit({...lead,requestId:'synthetic-request-002',[field]:'Тест'+character},origin,'ip').http,400)
 }
 for(const name of ['Имя\n','Имя\r','Имя\t']) assert.equal(f.store.admit({...lead,requestId:'synthetic-request-002',name},origin,'ip').http,400)
})
