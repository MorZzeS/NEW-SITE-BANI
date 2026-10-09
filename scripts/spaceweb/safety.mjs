import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditCompiled} from './audit-compiled.mjs';
import { fileURLToPath } from 'node:url';
export const scope = Object.freeze({branch:'spaceweb-staging',host:'banger.ru.swtest.ru',docroot:'/home/b/bangerramb/bangersu/public_html'});
export function guard(env=process.env) {
  if (env.GITHUB_REF !== 'refs/heads/'+scope.branch || env.SPACEWEB_BRANCH !== scope.branch || env.SPACEWEB_HOST !== scope.host || env.SPACEWEB_DOCROOT !== scope.docroot || env.NEXT_PUBLIC_LEADS_ENDPOINT !== '') throw Error('Staging branch/host/docroot/EMPTY endpoint guard failed');
}
export function safeName(name) {
  if (!name || name.startsWith('/') || name.includes('\\') || name.split('/').some(p=>!p||p==='.'||p==='..') || /[\x00-\x1f\x7f"'\x60]/.test(name)) throw Error('Unsafe relative path');
  if (/(^|\/)(private|config|userdata|backend|api|\.git)(\/|$)/i.test(name) || /\.(php\d?|phtml|phar|env|ini|conf|config|sql|bak|log|key|pem)$/i.test(name)) throw Error('Protected file');
  if (name.split('/').some(p=>p.startsWith('.') && p!=='.htaccess')) throw Error('Hidden file');
  return name;
}
export function inventory(root) {
  const records=[];
  function walk(dir) {for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const full=path.join(dir,e.name), relative=path.relative(root,full).split(path.sep).join('/');
    if(e.isFile()&&e.name==='.gitkeep'&&fs.statSync(full).size===0)continue; // empty export placeholder, never deployed
    safeName(relative);
    if(e.isSymbolicLink()) throw Error('Symlink rejected');
    if(e.isDirectory()) walk(full);
    else if(e.isFile()) records.push({path:relative,bytes:fs.statSync(full).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex')});
    else throw Error('Special file rejected');
  }}
  walk(root); return records.sort((a,b)=>a.path.localeCompare(b.path));
}
export function verify(root) {
  const actual=inventory(root), manifest=JSON.parse(fs.readFileSync(root+'.manifest.json','utf8'));
  if(manifest.version!==1 || manifest.host!==scope.host || manifest.docroot!==scope.docroot || JSON.stringify(manifest.files)!==JSON.stringify(actual)) throw Error('Manifest mismatch');
  if(manifest.leadsEndpoint!==''||manifest.interactive!==true)throw Error('Expected EMPTY endpoint with hydration');
  auditCompiled(root,'');
  for(const file of actual.filter(f=>f.path.endsWith('.js')))if(manifest.sourceFiles?.find(f=>f.path===file.path)?.sha256!==file.sha256)throw Error('Compiled script changed: '+file.path);
  if(!actual.some(f=>f.path==='index.html')||!actual.some(f=>f.path==='.htaccess')) throw Error('Missing root files');
  for(const f of actual.filter(f=>f.path.endsWith('.html'))) {
    const html=fs.readFileSync(path.join(root,f.path),'utf8');
    if(!/<meta name="robots" content="noindex, nofollow, noarchive"/.test(html)) throw Error('Missing noindex: '+f.path);
  }
  if(fs.readFileSync(path.join(root,'robots.txt'),'utf8')!=='User-agent: *\nDisallow: /\n') throw Error('robots mismatch');
  return actual.length;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv[2]==='guard') guard();
  else if(process.argv[2]==='verify') console.log('PASS artifact files:',verify(path.resolve(process.argv[3])));
  else throw Error('Expected guard or verify');
}
