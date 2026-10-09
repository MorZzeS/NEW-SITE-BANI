// Offline integration packaging audit; never builds or contacts a server.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {inventory,verify,scope} from './safety.mjs';
import {auditCompiled} from './audit-compiled.mjs';
const source=path.resolve(process.argv[2]||'dist'), parent=path.resolve('scripts/spaceweb');
const initial=inventory(source), compiled=auditCompiled(source,'');
const fixture=fs.mkdtempSync(path.join(parent,'spaceweb-review-')),output=path.join(fixture,'artifact');
let html=0,scripts=0,forms=0,checks=0;
try {
 const env={...process.env,GITHUB_REF:'refs/heads/'+scope.branch,SPACEWEB_BRANCH:scope.branch,SPACEWEB_HOST:scope.host,SPACEWEB_DOCROOT:scope.docroot,NEXT_PUBLIC_LEADS_ENDPOINT:''};
 const run=spawnSync(process.execPath,['scripts/spaceweb/prepare.mjs',source,output],{env,encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);checks++;
 const files=verify(output);checks++;
 const packaged=new Map(inventory(output).map(f=>[f.path,f]));
 for(const f of initial){
  if(f.path.endsWith('.html')){
   const before=fs.readFileSync(path.join(source,f.path),'utf8'),after=fs.readFileSync(path.join(output,f.path),'utf8');
   const tags=(s,re)=>s.match(re)||[];
   const beforeScripts=tags(before,/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi);
   const beforeForms=tags(before,/<\/?form\b[^>]*>/gi);
   assert.deepEqual(tags(after,/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi),beforeScripts);
   assert.deepEqual(tags(after,/<\/?form\b[^>]*>/gi),beforeForms);
   assert.equal(after.slice(after.indexOf('</head>')),before.slice(before.indexOf('</head>')));
   html++;scripts+=beforeScripts.length;forms+=beforeForms.filter(s=>!s.startsWith('</')).length;checks+=3;
  }else if(f.path!=='robots.txt'&&f.path!=='.htaccess'){assert.equal(packaged.get(f.path)?.sha256,f.sha256);checks++;}
 }
 assert.deepEqual(inventory(source),initial);checks++;
 const report={result:'PASS',input:source,inputFiles:initial.length,artifactFiles:files,htmlPages:html,preservedScriptTags:scripts,preservedFormOpenTags:forms,compiledAudit:compiled,checks,sourceUnchanged:true,buildRun:false,network:false,artifact:'temporary owned-dir package verified and cleaned'};
 fs.writeFileSync('docs/deployment/existing-build-verification.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}finally{
 const resolved=fs.realpathSync(fixture);
 if(path.dirname(resolved)!==fs.realpathSync(parent)||!path.basename(resolved).startsWith('spaceweb-review-'))throw Error('Unsafe cleanup');
 fs.rmSync(resolved,{recursive:true,force:true});
}
