import fs from 'node:fs'
import crypto from 'node:crypto'
const names=['leads-server.mjs','lead-validation.mjs','package.json','render-start.mjs','start-server.mjs','certs/mincifry-ca.pem']
const files=Object.fromEntries(names.map(name=>[name,fs.readFileSync(`backend/${name}`,'utf8')]))
const payload=JSON.stringify(files),digest=crypto.createHash('sha256').update(payload).digest('hex'),encoded=Buffer.from(payload).toString('base64')
const bootstrap=`const fs=require("node:fs"),c=require("node:crypto"),b=Buffer.from("${encoded}","base64");if(c.createHash("sha256").update(b).digest("hex")!=="${digest}")throw Error("Bundle checksum mismatch");for(const[n,s]of Object.entries(JSON.parse(b))){if(!${JSON.stringify(names)}.includes(n))throw Error("Unexpected file");const p=".render-backend/"+n;fs.mkdirSync(require("node:path").dirname(p),{recursive:true});fs.writeFileSync(p,s)};console.log("Backend bundle verified: ${digest}")`
fs.writeFileSync(process.argv[2],JSON.stringify({sha256:digest,buildCommand:`node -e '${bootstrap}'`,startCommand:'node .render-backend/render-start.mjs',files:names},null,2))
console.log(JSON.stringify({sha256:digest,files:names,commandLength:bootstrap.length}))
