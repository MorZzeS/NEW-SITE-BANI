// Offline operator tool. Backup may read a running WAL database; restore requires a NEW path.
import { DatabaseSync, backup } from 'node:sqlite'
import { existsSync, chmodSync, readFileSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import { hash } from './durable-store.mjs'
const [mode,source,destination,expectedHash] = process.argv.slice(2)
if (!['backup','restore'].includes(mode) || !isAbsolute(source || '') || !isAbsolute(destination || '') || !existsSync(source) || existsSync(destination) || existsSync(destination+'-wal') || existsSync(destination+'-shm') || existsSync(destination+'.lock')) throw new Error('Usage: backup|restore absolute-source absolute-NEW-destination [sha256 for restore]')
if(mode==='restore' && (!/^[a-f0-9]{64}$/.test(expectedHash || '') || hash(readFileSync(source)) !== expectedHash)) throw new Error('Restore checksum mismatch')
const db=new DatabaseSync(source,{readOnly:true})
try {
  if(db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Integrity check failed')
  if(db.prepare('PRAGMA foreign_key_check').all().length) throw new Error('Foreign key check failed')
  for(const doc of db.prepare('SELECT text,sha256 FROM documents').all()) if(hash(doc.text)!==doc.sha256) throw new Error('Archived document corrupted')
  await backup(db,destination); chmodSync(destination,0o600)
} finally {db.close()}
if (mode === 'restore') {
  const restored = new DatabaseSync(destination)
  try { restored.exec("PRAGMA synchronous=FULL; UPDATE outbox SET status='unknown' WHERE status!='sent';") } finally { restored.close() }
}
console.log(JSON.stringify({operation:mode,sha256:hash(readFileSync(destination))}))
