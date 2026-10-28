import { DatabaseSync, backup } from 'node:sqlite'
import { createHash, randomUUID } from 'node:crypto'
import { readFileSync, existsSync, chmodSync, statSync } from 'node:fs'
import { isAbsolute, dirname } from 'node:path'
import { validateLead } from './lead-validation.mjs'

export const hash = value => createHash('sha256').update(value).digest('hex')
const canonical = value => JSON.stringify(value, Object.keys(value).sort())
const keys = (o, names) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).sort().join() === [...names].sort().join()
export function readBundle(path) {
  const bundle = JSON.parse(readFileSync(path, 'utf8'))
  if (!keys(bundle, ['approved','documents']) || bundle.approved !== true || !keys(bundle.documents,['consent','checkbox','policy'])) throw new Error('Approved document bundle required')
  for (const doc of Object.values(bundle.documents)) {
    if (!keys(doc,['version','text','sha256']) || typeof doc.version !== 'string' || !doc.version.trim() || doc.version.length > 100 || typeof doc.text !== 'string' || !doc.text.trim() || doc.sha256 !== hash(doc.text)) throw new Error('Document hash/version invalid')
  }
  return bundle
}
export function validateV3(data, bundle, origin, now) {
  if (!validateLead(data, now) || data.contractVersion !== 3 || data.purposeCode !== 'inquiry_response' || data.action !== 'unchecked_checkbox_then_submit') return false
  const fields = ['contractVersion','consentVersion','policyVersion','checkboxVersion','purposeCode','action','consentTextSha256','checkboxTextSha256','policyTextSha256','requestId','name','phone','model','page','comment','createdAt','consent','website','startedAt','source','article','configuration','promotion','modelKind']
  if (!keys(data, fields) || !['Карточка модели','Получить консультацию','Контакты','Конфигуратор','Exit-intent'].includes(data.source) || typeof data.article !== 'string' || data.article.length > 80 || typeof data.configuration !== 'string' || data.configuration.length > 2000 || !['','bath','house'].includes(data.modelKind) || !['','Скидка 15 000 ₽'].includes(data.promotion) || (data.promotion && (data.modelKind !== 'bath' || data.source !== 'Exit-intent'))) return false
  if (Object.entries(data).some(([key, value]) => typeof value === 'string' && (['comment','configuration'].includes(key) ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value))) return false
  if (typeof data.createdAt !== 'string' || !Number.isFinite(Date.parse(data.createdAt))) return false
  for (const kind of ['consent','checkbox','policy']) if (data[`${kind}Version`] !== bundle.documents[kind].version || data[`${kind}TextSha256`] !== bundle.documents[kind].sha256) return false
  try { const page = new URL(data.page); return page.origin === origin && page.protocol === 'https:' && !page.username && !page.password && !page.search && !page.hash && (origin !== 'https://morzzes.github.io' || page.pathname === '/NEW-SITE-BANI' || page.pathname.startsWith('/NEW-SITE-BANI/')) } catch { return false }
}
const response = (requestId, status, admitted, receipt, retryable = false) => ({ http: status === 'sent' ? 200 : status === 'accepted' ? 202 : status === 'rejected' ? (retryable ? 429 : 400) : status === 'conflict' ? 409 : 503, body: {ok: ['sent','accepted'].includes(status),contractVersion:3,requestId,status,admitted,retryable,...(receipt ? {receipt} : {})} })
export class DurableStore {
  constructor({path, bundlePath, now = Date.now, fault = () => {}}) {
    if (!isAbsolute(path) || path === ':memory:' || !statSync(dirname(path)).isDirectory()) throw new Error('Absolute durable disk path required')
    this.path = path; this.bundle = readBundle(bundlePath); this.now = now; this.fault = fault
    this.db = new DatabaseSync(path)
    chmodSync(path, 0o600)
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS documents(kind TEXT NOT NULL,version TEXT NOT NULL,text TEXT NOT NULL,sha256 TEXT NOT NULL,PRIMARY KEY(kind,version));
      CREATE TRIGGER IF NOT EXISTS immutable_documents_update BEFORE UPDATE ON documents BEGIN SELECT RAISE(ABORT,'immutable document'); END;
      CREATE TRIGGER IF NOT EXISTS immutable_documents_delete BEFORE DELETE ON documents BEGIN SELECT RAISE(ABORT,'immutable document'); END;
      CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,fingerprint TEXT NOT NULL,payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS consents(id TEXT PRIMARY KEY REFERENCES leads(id),receipt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY REFERENCES leads(id),status TEXT NOT NULL CHECK(status IN ('accepted','claimed','sent','unknown')),due INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,message_id TEXT);
      CREATE TABLE IF NOT EXISTS rates(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);`)
    this.db.exec('BEGIN IMMEDIATE')
    try {
      for (const doc of this.db.prepare('SELECT text,sha256 FROM documents').all()) if (hash(doc.text) !== doc.sha256) throw new Error('Archived document hash invalid')
      for (const [kind, doc] of Object.entries(this.bundle.documents)) {
        const existing = this.db.prepare('SELECT text,sha256 FROM documents WHERE kind=? AND version=?').get(kind,doc.version)
        if (existing && (existing.text !== doc.text || existing.sha256 !== doc.sha256)) throw new Error('Archived version differs')
        this.db.prepare('INSERT OR IGNORE INTO documents VALUES(?,?,?,?)').run(kind,doc.version,doc.text,doc.sha256)
      }
      // Single process owns this disk. A previous claim may already have reached MAX.
      this.db.exec("UPDATE outbox SET status='unknown' WHERE status='claimed'; COMMIT")
    } catch (error) { this.db.exec('ROLLBACK'); this.db.close(); throw error }
  }
  admit(data, origin, ip) {
    const id = typeof data?.requestId === 'string' ? data.requestId.slice(0,80) : ''
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(id)) return response(id,'rejected',false)
    try {if (new URL(data.page).origin !== origin) return response(id,'rejected',false)} catch {return response(id,'rejected',false)}
    const fingerprint = hash(canonical(data))
    let began = false
    try {
      this.db.exec('BEGIN IMMEDIATE'); began = true
      const prior = this.db.prepare('SELECT fingerprint,receipt,status FROM leads JOIN consents USING(id) JOIN outbox USING(id) WHERE id=?').get(id)
      if (prior) { this.db.exec('ROLLBACK'); return prior.fingerprint !== fingerprint ? response(id,'conflict',true) : response(id,prior.status,true,JSON.parse(prior.receipt)) }
      if (!validateV3(data,this.bundle,origin,this.now())) {this.db.exec('ROLLBACK'); return response(id,'rejected',false)}
      const key = hash(ip), now = this.now()
      this.db.prepare('DELETE FROM rates WHERE expires<=?').run(now)
      const rate = this.db.prepare('SELECT count FROM rates WHERE key=?').get(key)
      if ((rate?.count || 0) >= 5) { this.db.exec('ROLLBACK'); return response(id,'rejected',false,undefined,true) }
      this.db.prepare('INSERT INTO rates VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,now+600000)
      const receipt = {contractVersion:3,receiptId:randomUUID(),requestId:id,receivedAt:new Date(now).toISOString(),purposeCode:data.purposeCode,consent:true,action:data.action,page:data.page,consentVersion:data.consentVersion,policyVersion:data.policyVersion,consentTextSha256:data.consentTextSha256,checkboxTextSha256:data.checkboxTextSha256,policyTextSha256:data.policyTextSha256}
      this.db.prepare('INSERT INTO leads VALUES(?,?,?)').run(id,fingerprint,JSON.stringify(data))
      this.db.prepare('INSERT INTO consents VALUES(?,?)').run(id,JSON.stringify(receipt))
      this.fault('before_outbox')
      this.db.prepare("INSERT INTO outbox(id,status,due) VALUES(?,'accepted',?)").run(id,now)
      this.db.exec('COMMIT'); began = false; this.fault('after_commit')
      return response(id,'accepted',true,receipt)
    } catch {
      let rolledBack = false
      if (began) { try { this.db.exec('ROLLBACK'); rolledBack = true } catch {} }
      // A successful rollback proves non-admission even if COMMIT failed while transaction remained active.
      return rolledBack ? response(id,'storage_unavailable',false,undefined,true) : response(id,'unknown',null)
    }
  }
  async work(notify, timeoutMs = 10000) {
    this.db.exec('BEGIN IMMEDIATE')
    let row
    try {
      row = this.db.prepare("SELECT id,payload,receipt FROM outbox JOIN leads USING(id) JOIN consents USING(id) WHERE status='accepted' AND due<=? ORDER BY due LIMIT 1").get(this.now())
      if (row) this.db.prepare("UPDATE outbox SET status='claimed',attempts=attempts+1 WHERE id=?").run(row.id)
      this.db.exec('COMMIT')
    } catch (error) { this.db.exec('ROLLBACK'); throw error }
    if (!row) return false
    let timer, result
    const controller = new AbortController()
    try {
      result = await Promise.race([Promise.resolve().then(() => notify({...JSON.parse(row.payload),receivedAt:JSON.parse(row.receipt).receivedAt},controller.signal)),new Promise((_,reject) => { timer = setTimeout(() => {controller.abort(); reject(new Error('timeout'))},timeoutMs) })])
    } catch { result = {status:'unknown'} } finally { clearTimeout(timer) }
    const status = result?.status === 'sent' && typeof result.messageId === 'string' && result.messageId.trim() ? 'sent' : result?.status === 'retry429' ? 'accepted' : 'unknown'
    const delay = Math.min(3600000,Math.max(1000,Number(result?.retryAfterMs) || 60000))
    this.db.prepare('UPDATE outbox SET status=?,due=?,message_id=? WHERE id=? AND status=\'claimed\'').run(status,this.now()+delay,status === 'sent' ? result.messageId : null,row.id)
    return true
  }
  close() { this.db.close() }
  async backupTo(destination) {
    if (!isAbsolute(destination) || existsSync(destination)) throw new Error('New absolute private backup path required')
    await backup(this.db,destination); chmodSync(destination,0o600)
    const check = new DatabaseSync(destination,{readOnly:true})
    try { if (check.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Backup integrity failed') } finally { check.close() }
    return hash(readFileSync(destination))
  }
}
