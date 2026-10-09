import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require('typescript');
export function auditCompiled(root,configuredEndpoint=process.env.NEXT_PUBLIC_LEADS_ENDPOINT){
 if(configuredEndpoint!=='')throw Error('Explicit EMPTY configured endpoint required');
 const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isSymbolicLink())throw Error('Symlink');if(e.isDirectory())walk(p);else if(e.isFile())files.push(p);}}walk(root);
 let scripts=0,inlineScripts=0,endpointInitializers=0,httpGuard=false,scriptReferences=0;
 const normalize=s=>s.replace(/\\u([0-9a-f]{4})/gi,(_,h)=>String.fromCharCode(parseInt(h,16))).replace(/\\x([0-9a-f]{2})/gi,(_,h)=>String.fromCharCode(parseInt(h,16))).replace(/&#(?:x([0-9a-f]+)|(\d+));/gi,(_,h,d)=>String.fromCharCode(parseInt(h||d,h?16:10)));
 const render=s=>{if(/onrender\s*\.|(?:^|[/.])render\.com\b/i.test(normalize(s)))throw Error('Render/onrender reference');};
 function literal(n){if(!n)return undefined;if(ts.isStringLiteralLike(n))return n.text;if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.PlusToken){const a=literal(n.left),b=literal(n.right);if(a!==undefined&&b!==undefined)return a+b;}return undefined;}
 function code(s,name,inline=false){
  render(s);const tree=ts.createSourceFile(name,s,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  if(tree.parseDiagnostics.length)throw Error('Unparsed executable script: '+name);
  let localEndpoint=false;
  function visit(n){
   const text=literal(n);if(text!==undefined)render(text);
   if(ts.isPropertyAccessExpression(n)&&n.name.text==='NEXT_PUBLIC_LEADS_ENDPOINT'){
    const bin=n.parent,decl=bin?.parent;
    if(!ts.isBinaryExpression(bin)||bin.left!==n||bin.operatorToken.kind!==ts.SyntaxKind.BarBarToken||literal(bin.right)!==''||!ts.isVariableDeclaration(decl)||decl.initializer!==bin)throw Error('Non-empty/unrecognized actual endpoint initializer: '+name);
    endpointInitializers++;localEndpoint=true;
   }
   if(ts.isCallExpression(n)){
    const callee=n.expression.getText(tree);
    if(/(?:^|\.)fetch$|(?:^|\.)sendBeacon$|\.open$/.test(callee)){
     const dest=literal(n.arguments[callee.endsWith('.open')?1:0]);
     if(dest!==undefined&&/^(?:https?:)?\/\//i.test(dest))throw Error('External literal network destination: '+name);
     if(inline)throw Error('Inline network call: '+name);
    }
   }
   if(inline&&ts.isNewExpression(n)&&/WebSocket|XMLHttpRequest|EventSource/.test(n.expression.getText(tree)))throw Error('Inline network constructor: '+name);
   ts.forEachChild(n,visit);
  }visit(tree);
  if(localEndpoint){
   if(!/"https:"\s*!==\s*location\.protocol/.test(s)||!s.includes('На HTTP-тестовом сайте отправка заявок отключена'))throw Error('Lead initializer lacks HTTP rejection: '+name);
   httpGuard=true;
  }
 }
 for(const p of files){
  const relative=path.relative(root,p);
  if(/\.(?:html?|js|mjs|cjs|json|txt|xml|svg|css)$/i.test(p))render(fs.readFileSync(p,'utf8'));
  if(/\.(?:js|mjs|cjs)$/i.test(p)){code(fs.readFileSync(p,'utf8'),relative);scripts++;}
  if(/\.html?$/i.test(p)){
   const html=fs.readFileSync(p,'utf8');
   for(const tag of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    const attrs=tag[1],src=attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if(src){const url=decodeURIComponent(src[1].split(/[?#]/)[0]);render(url);if(/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url))throw Error('External script reference: '+relative);
     const full=path.resolve(root,url.startsWith('/')?'.'+url:path.relative(root,path.dirname(p))+'/'+url.split(/[?#]/)[0]);
     if(!full.startsWith(path.resolve(root)+path.sep)||!fs.existsSync(full))throw Error('Missing/unsafe script reference: '+url);scriptReferences++;
    }else if(!/\btype\s*=\s*["'](?:application\/ld\+json|application\/json)["']/i.test(attrs)){code(tag[2],relative+'#inline',true);inlineScripts++;}
   }
   if(/\bon\w+\s*=\s*["'][^"']*(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource)/i.test(html)||/javascript:[^"']*(?:fetch|XMLHttpRequest|sendBeacon)/i.test(html))throw Error('Inline handler network API: '+relative);
  }
 }
 if(!endpointInitializers||!httpGuard)throw Error('Missing actual EMPTY-fallback endpoint initializer/HTTP rejection');
 return {scripts,inlineScripts,scriptReferences,endpointInitializers,emptyConfiguredEndpoint:true,compiledEmptyFallback:true,httpGuard:true,renderReferences:0,assurance:'Static recognized initializer and literal/reference audit; not arbitrary-code or dynamic-destination proof'};
}
