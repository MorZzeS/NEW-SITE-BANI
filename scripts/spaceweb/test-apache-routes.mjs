import http from 'node:http';
import fs from 'node:fs';import path from 'node:path';import {spawn,spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const runtime=String.raw`C:\Users\maxto\Desktop\НОВЫЙ САЙТ\spaceweb-preparation\qa\runtime\Apache24`,parent=path.resolve('scripts/spaceweb'),dir=fs.mkdtempSync(path.join(parent,'spaceweb-apache-')),doc=path.join(dir,'public');
const slash=s=>s.replaceAll('\\','/');let processChild;const results=[],baseline=[];let checks=0;
function request(port,url,host='banger.ru.swtest.ru'){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port,path:url,headers:{Host:host}},r=>{let body='';r.setEncoding('utf8');r.on('data',s=>body+=s);r.on('end',()=>resolve({status:r.statusCode,location:r.headers.location||null,robots:r.headers['x-robots-tag']||null,type:r.headers['content-type']||null,body}));});req.on('error',reject);req.setTimeout(5000,()=>req.destroy(Error('Timeout')));req.end();});}try{
 for(const route of ['/','/katalog/bani','/katalog/bani/'])try{const r=await request(18779,route);baseline.push({route,status:r.status,location:r.location});}catch(e){baseline.push({route,error:e.message});}
 fs.mkdirSync(doc,{recursive:true});
 const write=(file,body)=>{const p=path.join(doc,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,body);};
 write('index.html','ROOT');write('404.html','NOT FOUND');write('katalog/bani.html','BANI');write('katalog/bani/asset.txt','ASSET');write('poleznoe/example.html','ARTICLE');write('poleznoe/example/index.html','ARTICLE ALIAS');write('private/data.txt','PRIVATE');write('config/data.txt','CONFIG');write('userdata/data.txt','USERDATA');write('test.php','PHP');write('pic.webp','WEBP');write('pic.avif','AVIF');write('video.mp4','MP4');
 fs.copyFileSync('docs/deployment/staging.htaccess',path.join(doc,'.htaccess'));
 const conf=path.join(dir,'httpd.conf');
 fs.writeFileSync(conf,`ServerRoot "${slash(runtime)}"
Listen 127.0.0.1:18789
ServerName banger.ru.swtest.ru
LoadModule authz_core_module modules/mod_authz_core.so
LoadModule mime_module modules/mod_mime.so
LoadModule dir_module modules/mod_dir.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
LoadModule log_config_module modules/mod_log_config.so
DocumentRoot "${slash(doc)}"
<Directory "${slash(doc)}">
AllowOverride All
Require all granted
</Directory>
TypesConfig conf/mime.types
ErrorLog "${slash(path.join(dir,'error.log'))}"
CustomLog "${slash(path.join(dir,'access.log'))}" common
PidFile "${slash(path.join(dir,'httpd.pid'))}"
`);
 const exe=path.join(runtime,'bin','httpd.exe'),syntax=spawnSync(exe,['-t','-f',conf],{encoding:'utf8',windowsHide:true});assert.equal(syntax.status,0,syntax.stderr);checks++;
 processChild=spawn(exe,['-X','-f',conf],{windowsHide:true,stdio:'ignore'});
 let ready=false;for(let i=0;i<40;i++){try{await request(18789,'/');ready=true;break;}catch{}await new Promise(r=>setTimeout(r,100));}assert(ready,'Fixture Apache failed start');checks++;
 const cases=[['/',200,'ROOT'],['/katalog/bani',200,'BANI'],['/katalog/bani/',200,'BANI'],['/poleznoe/example',200,'ARTICLE'],['/poleznoe/example/',200,'ARTICLE ALIAS'],['/missing',404,'NOT FOUND'],['/private/data.txt',403],['/config/data.txt',403],['/userdata/data.txt',403],['/test.php',403],['/.htaccess',403],['/pic.webp',200,'WEBP','image/webp'],['/pic.avif',200,'AVIF','image/avif'],['/video.mp4',200,'MP4','video/mp4']];
 for(const [route,status,body,type] of cases){const r=await request(18789,route);assert.equal(r.status,status,route);assert.equal(r.location,null,route+' unexpected redirect');if(body)assert.equal(r.body,body);if(type)assert(r.type.startsWith(type));assert.equal(r.robots,'noindex, nofollow, noarchive');checks++;results.push({route,status:r.status,type:r.type,location:r.location});}
 const bad=await request(18789,'/','production.invalid');assert.equal(bad.status,403);checks++;
 const report={result:'PASS',checks,baseline,fixture:results,sourceConfigModified:false,sourceDistModified:false,liveHostContacted:false,loopbackPorts:[18779,18789],scope:'Isolated Apache 2.4 fixture; not hosting-provider proof'};
 fs.writeFileSync('docs/deployment/apache-route-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}catch(e){console.error(fs.readFileSync(path.join(dir,'error.log'),'utf8'));throw e;}finally{
 if(processChild){processChild.kill();await new Promise(r=>setTimeout(r,600));}
 const resolved=fs.realpathSync(dir);if(path.dirname(resolved)!==fs.realpathSync(parent)||!path.basename(resolved).startsWith('spaceweb-apache-'))throw Error('Unsafe fixture cleanup');fs.rmSync(resolved,{recursive:true,force:true});
}
