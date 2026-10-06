import { createLeadServer } from './leads-server.mjs'
import { readFileSync } from 'node:fs'
import { X509Certificate } from 'node:crypto'
import tls from 'node:tls'
console.log('Node version',process.version)
console.log('NODE_EXTRA_CA_CERTS',process.env.NODE_EXTRA_CA_CERTS)
const ca = new X509Certificate(readFileSync(process.env.NODE_EXTRA_CA_CERTS))
console.log('Loaded CA',ca.subject,ca.fingerprint256)
if (!process.env.MAX_BOT_TOKEN || process.env.MAX_USER_ID !== '2758798') throw new Error('Private MAX environment is not configured')
try {
 const response=await fetch('https://platform-api2.max.ru/me',{headers:{Authorization:process.env.MAX_BOT_TOKEN},signal:AbortSignal.timeout(10000)})
 if(!response.ok){console.error('MAX /me HTTP status',response.status);process.exitCode=1}
 else {
  const bot=await response.json()
  if(!bot.user_id||bot.is_bot!==true)throw new Error('MAX bot response not confirmed')
  console.log('MAX /me PASS',response.status)
  createLeadServer().listen(Number(process.env.PORT||8787),'0.0.0.0')
 }
} catch(error) {
 console.error('MAX preflight failed',error?.cause?.code||error?.code||error.name)
 // Read certificates only; verification stays enabled and no authorization is sent.
 await new Promise(resolve=>{
  const socket=tls.connect({host:'platform-api2.max.ru',port:443,servername:'platform-api2.max.ru'})
  const report=()=>{const chain=[];let cert=socket.getPeerCertificate(true);const seen=new Set();while(cert?.fingerprint256&&!seen.has(cert.fingerprint256)){seen.add(cert.fingerprint256);chain.push({subject:cert.subject,issuer:cert.issuer,fingerprint256:cert.fingerprint256});cert=cert.issuerCertificate}console.error('MAX certificate chain',JSON.stringify(chain));socket.destroy();resolve()}
  socket.on('secureConnect',report);socket.on('error',report);socket.setTimeout(10000,report)
 });process.exitCode=1
}
