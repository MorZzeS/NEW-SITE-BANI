import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { X509Certificate } from 'node:crypto'
const caPath = fileURLToPath(new URL('./certs/mincifry-ca.pem', import.meta.url))
const ca = new X509Certificate(readFileSync(caPath))
if (!ca.ca || Date.parse(ca.validTo) <= Date.now()) throw new Error('Official CA is invalid or expired')
const child = spawn(process.execPath, ['--use-system-ca', fileURLToPath(new URL('./start-server.mjs', import.meta.url))], { stdio: 'inherit', env: { ...process.env, NODE_EXTRA_CA_CERTS: caPath } })
for (const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>child.kill(signal))
child.on('error',()=>{console.error('Backend child startup failed');process.exitCode=1})
child.on('exit',code=>{process.exitCode=code ?? 1})
