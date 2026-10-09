import path from 'node:path';
import {fileURLToPath} from 'node:url';
// Produces a reviewable plan only; no SSH, file upload or deletion.
import fs from 'node:fs';
import {scope,safeName} from './safety.mjs';
export function plan(previous,next,remote) {
 const validate=m=>{if(m.version!==1||m.host!==scope.host||m.docroot!==scope.docroot||!Array.isArray(m.files))throw Error('Scope mismatch');
 const seen=new Set();for(const f of m.files){safeName(f.path);if(seen.has(f.path)||!/^[a-f0-9]{64}$/.test(f.sha256)||!Number.isSafeInteger(f.bytes)||f.bytes<0)throw Error('Invalid manifest');seen.add(f.path);}};
 validate(previous);validate(next);validate(remote);
 const old=new Map(previous.files.map(f=>[f.path,f])), live=new Map(remote.files.map(f=>[f.path,f]));
 for(const f of previous.files)if(live.get(f.path)?.sha256!==f.sha256)throw Error('Remote drift/missing owned file: '+f.path);
 for(const f of next.files)if(live.has(f.path)&&!old.has(f.path))throw Error('Unowned collision: '+f.path);
 const names=new Set(next.files.map(f=>f.path));
 return {mode:'NON_ATOMIC_REVIEW_ONLY',docroot:scope.docroot,
 backup:previous.files.map(f=>f.path),
 upload:next.files.filter(f=>old.get(f.path)?.sha256!==f.sha256).map(f=>f.path),
 retireAfterVerification:previous.files.filter(f=>!names.has(f.path)).map(f=>f.path),
 preserveUnowned:remote.files.filter(f=>!old.has(f.path)).map(f=>f.path),
 rollback:{restoreFromVerifiedBackup:previous.files.map(f=>f.path),removeNewOnly:next.files.filter(f=>!old.has(f.path)).map(f=>f.path)},
 gate:'No execution: verified backup, staging approval, host capability and route checks required'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));console.log(JSON.stringify(plan(...process.argv.slice(2,5).map(read)),null,2));}
