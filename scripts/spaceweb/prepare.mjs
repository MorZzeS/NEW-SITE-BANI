// OFFLINE only: consumes an already built export; never invokes build or network.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {guard,inventory,scope,verify} from './safety.mjs';
import {auditCompiled} from './audit-compiled.mjs';
guard();
const source=path.resolve(process.argv[2]||'dist'), target=path.resolve(process.argv[3]||'staging-artifact');
if(fs.existsSync(target)||fs.existsSync(target+'.manifest.json')) throw Error('Refuse overwrite: choose new artifact path');
if(target===source||target.startsWith(source+path.sep)||source.startsWith(target+path.sep)) throw Error('Overlapping artifact paths');
if(!fs.existsSync(path.join(source,'index.html'))) throw Error('Not a root static export');
const sourceFiles=inventory(source); const compiledAudit=auditCompiled(source); // fail before copying
fs.cpSync(source,target,{recursive:true,errorOnExist:true,force:false,filter:p=>path.basename(p)!=='.gitkeep'});
for(const file of inventory(target).filter(f=>f.path.endsWith('.html'))) {
 const name=path.join(target,file.path); let html=fs.readFileSync(name,'utf8');
 // Preserve hydration scripts, links and form DOM unchanged.
 html=html.replace(/<meta\b[^>]*name=["'](?:robots|googlebot)["'][^>]*>/gi,'');
 html=html.replace(/<head([^>]*)>/i,'<head$1><meta name="robots" content="noindex, nofollow, noarchive">');
 fs.writeFileSync(name,html);
}
fs.writeFileSync(path.join(target,'robots.txt'),'User-agent: *\nDisallow: /\n');
fs.copyFileSync(fileURLToPath(new URL('../../docs/deployment/staging.htaccess',import.meta.url)),path.join(target,'.htaccess'));
fs.writeFileSync(target+'.manifest.json',JSON.stringify({version:1,host:scope.host,docroot:scope.docroot,leadsEndpoint:'',interactive:true,compiledAudit,sourceFiles,files:inventory(target)},null,2)+'\n');
console.log('PASS offline staging package:',verify(target),'files; hydration preserved, no build/upload');
