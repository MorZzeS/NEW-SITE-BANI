import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditCompiled} from './audit-compiled.mjs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {guard,safeName,scope,inventory,verify} from './safety.mjs';
import {plan} from './plan.mjs';
const good={GITHUB_REF:'refs/heads/spaceweb-staging',SPACEWEB_BRANCH:scope.branch,SPACEWEB_HOST:scope.host,SPACEWEB_DOCROOT:scope.docroot,NEXT_PUBLIC_LEADS_ENDPOINT:''};
let checks=0;
const pass=()=>checks++;
guard(good);pass();
for(const key of Object.keys(good)){assert.throws(()=>guard({...good,[key]:'production'}));pass();}
for(const name of ['../index.html','/index.html','a\\b','private/x','userdata/a','config/a','x.php','.env','x/../a','x//a','x/.git/a']){assert.throws(()=>safeName(name));pass();}
safeName('.htaccess');pass();
const record=(name,hash='a')=>({path:name,bytes:1,sha256:hash.repeat(64)});
const manifest=files=>({version:1,host:scope.host,docroot:scope.docroot,files});
const old=manifest([record('index.html'),record('old.png')]),next=manifest([record('index.html','b'),record('new.png')]),remote=manifest([...old.files,record('owner.txt')]);
const p=plan(old,next,remote);
assert.deepEqual(p.preserveUnowned,['owner.txt']);assert.deepEqual(p.retireAfterVerification,['old.png']);assert.deepEqual(p.rollback.removeNewOnly,['new.png']);pass();
assert.throws(()=>plan(old,next,manifest([record('index.html','c'),record('old.png')])));pass();
assert.throws(()=>plan(old,manifest([...next.files,record('owner.txt')]),remote));pass();
assert.throws(()=>plan({...old,docroot:'/production'},next,remote));pass();
assert.throws(()=>plan(old,manifest([record('../private')]),remote));pass();
const fixtureParent=path.resolve('scripts/spaceweb');
const root=fs.mkdtempSync(path.join(fixtureParent,'spaceweb-safety-'));
try {
 const input=path.join(root,'input'),output=path.join(root,'output');fs.mkdirSync(input);
 fs.writeFileSync(path.join(input,'index.html'),'<html><head><meta name="robots" content="index"></head><body><form><input name="phone"></form><script>document.documentElement.dataset.theme="dark"</script></body></html>');
 fs.mkdirSync(path.join(input,'poleznoe','article'),{recursive:true});
 fs.copyFileSync(path.join(input,'index.html'),path.join(input,'poleznoe','article','index.html'));
 fs.mkdirSync(path.join(input,'_next','static'),{recursive:true});
 fs.writeFileSync(path.join(input,'_next','static','fixture.js'), 'let endpoint=env.NEXT_PUBLIC_LEADS_ENDPOINT||'+JSON.stringify('')+';if('+JSON.stringify('https:')+'!==location.protocol)throw Error('+JSON.stringify('На HTTP-тестовом сайте отправка заявок отключена')+');');
 const run=()=>spawnSync(process.execPath,['scripts/spaceweb/prepare.mjs',input,output],{env:{...process.env,...good},encoding:'utf8'});
 let r=run();assert.equal(r.status,0,r.stderr);pass();verify(output);pass();
 const html=fs.readFileSync(path.join(output,'index.html'),'utf8');assert(html.includes('<form><input name='+JSON.stringify('phone')+'></form>'));assert(html.includes('<script>document.documentElement.dataset.theme='+JSON.stringify('dark')+'</script>'));pass();
 assert.throws(()=>auditCompiled(input,'https://lead.invalid'));pass();
 const fixtureHtml=fs.readFileSync(path.join(input,'index.html'),'utf8');
 for(const injected of ['<script>fetch("https://lead.invalid")</script>','<script>fetch("https://x.onrender.com/leads")</script>','<script src="https://external.invalid/script.js"></script>','<img src="https://x.onrender.com/asset">']){fs.writeFileSync(path.join(input,'index.html'),fixtureHtml.replace('</body>',injected+'</body>'));assert.throws(()=>auditCompiled(input,''));pass();}
 fs.writeFileSync(path.join(input,'index.html'),fixtureHtml);
 const outside=path.join(input,'outside.js');fs.writeFileSync(outside,'fetch("https://external.invalid/leads")');assert.throws(()=>auditCompiled(input,''));pass();fs.unlinkSync(outside);
 const compiledFile=path.join(input,'_next','static','fixture.js'),compiledOriginal=fs.readFileSync(compiledFile,'utf8');
 fs.writeFileSync(compiledFile,compiledOriginal.replace('env.NEXT_PUBLIC_LEADS_ENDPOINT||""','env.NEXT_PUBLIC_LEADS_ENDPOINT||"https://endpoint.invalid"'));assert.throws(()=>auditCompiled(input,''));pass();
 fs.writeFileSync(compiledFile,compiledOriginal);
 const malicious=path.join(input,'_next','static','bad.js');fs.writeFileSync(malicious,'https://example.onrender.com/api/leads');assert.throws(()=>auditCompiled(input,''));fs.unlinkSync(malicious);pass();
 assert.notEqual(run().status,0);pass();
 fs.writeFileSync(path.join(output,'index.html'),html+'tamper');assert.throws(()=>verify(output));pass();
 const linkedTarget=path.join(root,'link-target');fs.mkdirSync(linkedTarget);fs.symlinkSync(linkedTarget,path.join(input,'linked'),'junction');assert.throws(()=>inventory(input));pass();
 const sshScript=path.resolve('scripts/spaceweb/ssh-config.mjs');
 const pinEnv={...process.env,SPACEWEB_STAGING_SSH_HOST:'ssh.example.invalid',SPACEWEB_STAGING_SSH_USER:'staging',SPACEWEB_STAGING_KNOWN_HOSTS:'ssh.example.invalid ssh-ed25519 AAAA'};
 const ssh=(env)=>spawnSync(process.execPath,[sshScript],{cwd:root,env,encoding:'utf8'});
 assert.notEqual(ssh({...pinEnv,SPACEWEB_STAGING_KNOWN_HOSTS:'other.invalid ssh-ed25519 AAAA'}).status,0);pass();
 assert.equal(ssh(pinEnv).status,0);pass();
 const conf=fs.readFileSync(path.join(root,'staging_ssh_config'),'utf8');assert(conf.includes('StrictHostKeyChecking yes'));assert(!conf.includes('StrictHostKeyChecking no'));pass();
 const workflow=fs.readFileSync('docs/deployment/spaceweb-staging.workflow.yml.template','utf8');
 assert(workflow.includes("github.ref == 'refs/heads/spaceweb-staging'"));assert(!/deploy-pages|pages: write|github-pages/.test(workflow));pass();
 const ht=fs.readFileSync('docs/deployment/staging.htaccess','utf8');
 for(const directive of ['Require all denied','image/webp','image/avif','video/mp4','noindex','connect-src \'self\'','form-action \'none\'','RewriteBase /'])assert(ht.includes(directive));
 pass();
} finally {
 // ONLY own freshly created fixture directory; resolve boundary before recursive removal.
 const resolved=fs.realpathSync(root),tmp=fs.realpathSync(fixtureParent);
 if(path.dirname(resolved)!==tmp||!path.basename(resolved).startsWith('spaceweb-safety-'))throw Error('Unsafe fixture cleanup');
 fs.rmSync(resolved,{recursive:true,force:true});
}
console.log('PASS '+checks+' offline safety checks; no build or network');
