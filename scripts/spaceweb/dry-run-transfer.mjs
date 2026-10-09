// OFFLINE ONLY. Generates reviewed SFTP text; no process/network/execute option.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {plan} from './plan.mjs';
import {scope,safeName} from './safety.mjs';
export const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function generate(bundle,approval,trustedOwnerPublicKey){
 const unsigned={...approval};delete unsigned.signature;
 if(approval.approved!==true||approval.planSha256!==digest(bundle)||!approval.owner||!approval.signature||!crypto.verify(null,Buffer.from(JSON.stringify(unsigned)),trustedOwnerPublicKey,Buffer.from(approval.signature,'base64')))throw Error('Unsigned/unapproved/changed plan');
 if(bundle.branch!==scope.branch||bundle.host!==scope.host||bundle.docroot!==scope.docroot)throw Error('Staging allowlist mismatch');
 if(JSON.stringify(bundle.reviewedPlan)!==JSON.stringify(plan(bundle.previous,bundle.next,bundle.remote)))throw Error('Reviewed owned-file plan mismatch');
 const caps=bundle.capabilities;
 if(bundle.temporaryNamesAbsentVerified!==true||!bundle.temporaryNamesEvidence)throw Error('Temporary-name absence unverified');
 if(!caps?.sftp||!caps.sameDirectoryRename||!caps.renameOverwrite||!caps.existingProtectionVerified||!caps.evidence)throw Error('Provider capabilities/protection unverified');
 if(bundle.backup?.verified!==true||bundle.backup.previousManifestSha256!==digest(bundle.previous)||!bundle.backup.receipt)throw Error('Verified backup missing');
 if(!/^[a-zA-Z0-9-]{8,40}$/.test(bundle.releaseId))throw Error('Invalid unique release ID');
 const ssh=bundle.ssh;
 if(!ssh||!/^[a-zA-Z0-9.-]+$/.test(ssh.host)||!/^[a-zA-Z0-9_-]+$/.test(ssh.user)||!Number.isInteger(ssh.port)||ssh.port<1||ssh.port>65535||!ssh.providerEvidence)throw Error('Unapproved SSH endpoint');
 const lookup=ssh.port===22?ssh.host:'['+ssh.host+']:'+ssh.port;
 const entry=ssh.knownHosts?.split(' ');
 if(entry?.length!==3||entry[0]!==lookup||entry[1]!=='ssh-ed25519'||!/^([A-Za-z0-9+/]+={0,2})$/.test(entry[2]))throw Error('Exact pinned ed25519 hostkey required');
 const wire=Buffer.from(entry[2],'base64');
 if(wire.length!==51||wire.readUInt32BE(0)!==11||wire.subarray(4,15).toString()!=='ssh-ed25519'||wire.readUInt32BE(15)!==32)throw Error('Invalid ed25519 SSH wire key');
 const fingerprint='SHA256:'+crypto.createHash('sha256').update(Buffer.from(entry[2],'base64')).digest('base64').replace(/=+$/,'');
 if(fingerprint!==ssh.verifiedFingerprint)throw Error('Hostkey fingerprint mismatch');
 const q=s=>'"'+s.replace(/[?*\[\]]/g,c=>'\\'+c)+'"',relative=name=>{safeName(name);if(!/^[a-zA-Z0-9_.\[\]/-]+$/.test(name))throw Error('Unsupported literal SFTP path');return name;};
 const knownDirs=new Set(bundle.remoteDirectories);
 if(!knownDirs.has(''))throw Error('Verified docroot directory missing');
 for(const d of knownDirs)if(d)relative(d);
 const remotePaths=new Set(bundle.remote.files.map(f=>f.path));
 const candidates=bundle.reviewedPlan.upload.map(relative);
 const rank=n=>n==='.htaccess'?-1:n==='index.html'?3:n.endsWith('.html')?2:1;
 candidates.sort((a,b)=>rank(a)-rank(b)||a.localeCompare(b));
 if(candidates.includes('index.html')){candidates.splice(candidates.indexOf('index.html'),1);candidates.push('index.html');}
 const mkdir=[],upload=[],rename=[],verifyTemporary=[];
 for(const name of candidates){
  const parent=path.posix.dirname(name)==='.'?'':path.posix.dirname(name);
  const parts=parent?parent.split('/'):[];
  for(let i=1;i<=parts.length;i++){const d=parts.slice(0,i).join('/');if(!knownDirs.has(d)){mkdir.push('mkdir '+q(scope.docroot+'/'+d));knownDirs.add(d);}}
  const temp=(parent?parent+'/':'')+'.spaceweb-'+bundle.releaseId+'-'+path.posix.basename(name);
  if(remotePaths.has(temp))throw Error('Temporary-name collision');
  upload.push('put '+q('./artifact/'+name)+' '+q(scope.docroot+'/'+temp));
  rename.push('rename '+q(scope.docroot+'/'+temp)+' '+q(scope.docroot+'/'+name));
  verifyTemporary.push({path:temp,sha256:bundle.next.files.find(f=>f.path===name).sha256});
 }
 return {status:'INACTIVE_REVIEW_ONLY',atomic:false,host:scope.host,docroot:scope.docroot,
 knownHosts:ssh.knownHosts,sshConfig:`Host spaceweb-staging
 HostName ${ssh.host}
 User ${ssh.user}
 Port ${ssh.port}
 IdentityFile staging_ssh_key
 IdentitiesOnly yes
 BatchMode yes
 StrictHostKeyChecking yes
 UserKnownHostsFile staging_known_hosts
 GlobalKnownHostsFile /dev/null
 UpdateHostKeys no
 PasswordAuthentication no
 KbdInteractiveAuthentication no
 ForwardAgent no
 ClearAllForwardings yes
`,
 uploadBatch:[...mkdir,...upload].join('\n'),commitBatch:rename.join('\n'),
 verifyTemporaryBeforeCommit:verifyTemporary,
 preserveUnowned:bundle.reviewedPlan.preserveUnowned,
 retirementCommands:[],
 gates:['No connection or execution provided','Verify private timestamped backup receipt and unchanged live owned hashes again','Download/hash ALL staged temporary files before any rename','Approve commit batch separately; root index rename last','Per-file rename is NON-ATOMIC across site; no symlink assumption','Retire old owned entries only by separately approved hash-checked plan; never blanket delete']};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==5)throw Error('Only: node dry-run-transfer.mjs bundle.json approval.json trusted-owner-public-key.pem; NO execute option');
 const bundle=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),approval=JSON.parse(fs.readFileSync(process.argv[3],'utf8')),key=fs.readFileSync(process.argv[4],'utf8');
 console.log(JSON.stringify(generate(bundle,approval,key),null,2));
}
