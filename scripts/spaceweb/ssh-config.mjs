// Offline configuration generator. Do not call ssh-keyscan or trust first use.
import fs from 'node:fs';
const {SPACEWEB_STAGING_SSH_HOST:host,SPACEWEB_STAGING_SSH_USER:user,SPACEWEB_STAGING_SSH_PORT:port='22',SPACEWEB_STAGING_KNOWN_HOSTS:known}=process.env;
if(!host||!user||!known||!/^[a-zA-Z0-9.-]+$/.test(host)||!/^[a-zA-Z0-9_-]+$/.test(user)||!/^\d+$/.test(port)||+port<1||+port>65535)throw Error('Missing/invalid staging SSH configuration');
const lookup=port==='22'?host:'['+host+']:'+port;
const lines=known.trim().split(/\r?\n/);
if(!lines.length||lines.some(line=>!line.startsWith(lookup+' ')||!/^\S+ (ssh-ed25519|ecdsa-sha2-nistp256|ssh-rsa) [A-Za-z0-9+/]+={0,3}$/.test(line)))throw Error('Expected exact independently verified pinned SSH host key');
if(fs.existsSync('staging_known_hosts')||fs.existsSync('staging_ssh_config'))throw Error('Refuse config overwrite');
fs.writeFileSync('staging_known_hosts',lines.join('\n')+'\n',{mode:0o600});
fs.writeFileSync('staging_ssh_config',`Host spaceweb-staging
 HostName ${host}
 User ${user}
 Port ${port}
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
`,{mode:0o600});
console.log('PASS pinned offline SSH config; no connection');
