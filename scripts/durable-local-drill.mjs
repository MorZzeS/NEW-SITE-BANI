import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'
import { createDurableServer } from '../backend/durable-server.mjs'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..')
const outDir = path.resolve(process.argv[2] || path.join(root, 'docs', 'calculator-pdf-forms-2026-11-02'))
const work = path.join(root, 'tmp', 'durable-drill')
fs.rmSync(work, { recursive: true, force: true })
fs.mkdirSync(work, { recursive: true })
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const documents = {
  consent: { version: 'drill-consent-v1', text: 'Согласие на обработку персональных данных. Тестовый документ локального учения; не является утверждённым юридическим текстом.' },
  checkbox: { version: 'drill-checkbox-v1', text: 'Я согласен на обработку персональных данных. Тестовая формулировка локального учения.' },
  policy: { version: 'drill-policy-v1', text: 'Политика обработки персональных данных. Тестовый документ локального учения.' },
}
for (const document of Object.values(documents)) document.sha256 = hash(document.text)
const bundlePath = path.join(work, 'documents.json')
fs.writeFileSync(bundlePath, JSON.stringify({ approved: true, documents }))
const dbPath = path.join(work, 'leads.db')
const backupPath = path.join(work, 'leads.backup.db')
const restorePath = path.join(work, 'restored', 'leads.db')
fs.mkdirSync(path.dirname(restorePath), { recursive: true })

const origin = 'https://morzzes.github.io'
let notifierCalls = 0
const notifier = async () => { notifierCalls++; return { status: 'sent', messageId: `drill-mid-${notifierCalls}` } }
const env = { DURABLE_LEADS_ENABLED: '1', SYNTHETIC_ONLY: '1', LEADS_DB_PATH: dbPath, LEAD_DOCUMENT_BUNDLE: bundlePath, ALLOWED_ORIGINS: origin }

function makeLead(overrides = {}) {
  return {
    contractVersion: 3,
    purposeCode: 'inquiry_response',
    action: 'unchecked_checkbox_then_submit',
    consentVersion: documents.consent.version,
    policyVersion: documents.policy.version,
    checkboxVersion: documents.checkbox.version,
    consentTextSha256: documents.consent.sha256,
    checkboxTextSha256: documents.checkbox.sha256,
    policyTextSha256: documents.policy.sha256,
    requestId: crypto.randomUUID(),
    name: 'Тест Тестов',
    phone: '+7 900 000-00-00',
    model: 'Исток 4',
    page: `${origin}/NEW-SITE-BANI/banya/istok-4`,
    comment: 'Локальная проверка постоянного хранилища. MAX не вызывается.',
    createdAt: new Date().toISOString(),
    consent: true,
    website: '',
    startedAt: Date.now() - 5000,
    source: 'Карточка модели',
    article: 'БГ-01',
    configuration: 'Базовая стоимость: 397 500 ₽; дополнения: +37 500 ₽; итого: 435 000 ₽',
    promotion: '',
    modelKind: 'bath',
    configurationDetails: {
      modelId: 'bg-01', modelName: 'Исток 4', modelType: 'sauna', basePrice: 397500,
      selectedOptionIds: ['boiler'], options: [{ id: 'boiler', name: 'Бойлер 50 л', price: 37500, quantity: 1 }],
      optionsSubtotal: 37500, discount: 0, discountLabel: '', total: 435000, unpricedCount: 0, currency: 'RUB',
      calculatedAt: new Date().toISOString(),
    },
    ...overrides,
  }
}

let instance = createDurableServer({ env, notifier })
const port = await new Promise(resolve => instance.server.listen(0, '127.0.0.1', () => resolve(instance.server.address().port)))
const url = `http://127.0.0.1:${port}/leads`
const post = async (lead, requestOrigin = origin) => {
  const response = await fetch(url, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
  return { status: response.status, body: await response.json().catch(() => ({})) }
}
const closeInstance = async () => { await new Promise(resolve => instance.server.close(() => resolve())); await sleep(150) }
const events = () => { const db = new DatabaseSync(dbPath, { readOnly: true }); try { return db.prepare('SELECT request_id,code FROM events ORDER BY sequence').all() } finally { db.close() } }
const outbox = () => { const db = new DatabaseSync(dbPath, { readOnly: true }); try { return db.prepare('SELECT id,status,message_id FROM outbox ORDER BY id').all() } finally { db.close() } }

const report = { startedAt: new Date().toISOString(), endpoint: url, steps: [], failures: [] }
const check = (name, condition, detail) => { report.steps.push({ name, ok: Boolean(condition), detail }); if (!condition) report.failures.push(name) }

try {
  const health = await fetch(`http://127.0.0.1:${port}/health`).then(r => r.status)
  check('health 200', health === 200, health)

  const lead = makeLead()
  const first = await post(lead)
  check('first real HTTP admission 202 accepted', first.status === 202 && first.body.status === 'accepted' && first.body.admitted === true, first)
  check('receipt returned for admitted lead', Boolean(first.body.receipt?.receiptId), first.body.receipt)
  await sleep(1800)
  const outboxAfter = outbox()
  check('outbox delivered exactly once', outboxAfter.length === 1 && outboxAfter[0].status === 'sent', outboxAfter)
  check('synthetic MAX notifier called once (no live MAX request)', notifierCalls === 1, notifierCalls)
  const journal = events().map(event => event.code)
  check('delivery journal records accepted and sent without raw error text', journal.join(',') === 'accepted,delivery_sent', journal)

  const duplicate = await post(lead)
  check('duplicate POST returns original receipt without resend', [200, 202].includes(duplicate.status) && duplicate.body.receipt?.receiptId === first.body.receipt?.receiptId, { status: duplicate.status, receipt: duplicate.body.receipt?.receiptId })
  await sleep(300)
  check('duplicate did not create a second delivery', notifierCalls === 1, notifierCalls)

  const conflict = await post({ ...lead, comment: 'Изменённый комментарий после приёма' })
  check('changed payload for accepted requestId returns 409', conflict.status === 409, conflict.status)

  const invalidConsent = await post(makeLead({ consent: false }))
  check('invalid consent rejected before storage', invalidConsent.status === 400 && invalidConsent.body.admitted === false, invalidConsent.status)
  const badOrigin = await post(makeLead(), 'https://evil.example')
  check('unauthorized origin rejected with 403', badOrigin.status === 403, badOrigin.status)

  const acceptedReceipt = first.body.receipt
  await closeInstance()
  instance = createDurableServer({ env, notifier })
  const port2 = await new Promise(resolve => instance.server.listen(0, '127.0.0.1', () => resolve(instance.server.address().port)))
  const url2 = `http://127.0.0.1:${port2}/leads`
  const afterRestart = await fetch(url2, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }).then(async response => ({ status: response.status, body: await response.json() }))
  check('durable restart keeps admission and returns the same receipt', [200, 202].includes(afterRestart.status) && afterRestart.body.receipt?.receiptId === acceptedReceipt.receiptId, { status: afterRestart.status, receipt: afterRestart.body.receipt?.receiptId, expected: acceptedReceipt.receiptId })
  const stored = (() => { const db = new DatabaseSync(dbPath, { readOnly: true }); try { return db.prepare('SELECT payload FROM leads').get() } finally { db.close() } })()
  check('structured configuration persisted in SQLite', JSON.parse(stored.payload).configurationDetails.total === 435000, JSON.parse(stored.payload).configurationDetails?.total)

  // Rate limit: five per ten minutes per pseudonymous IP; server sees loopback for all drill requests.
  await closeInstance()
  instance = createDurableServer({ env, notifier })
  const port3 = await new Promise(resolve => instance.server.listen(0, '127.0.0.1', () => resolve(instance.server.address().port)))
  const url3 = `http://127.0.0.1:${port3}/leads`
  const statuses = []
  for (let index = 0; index < 6; index++) {
    const response = await fetch(url3, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(makeLead()) })
    statuses.push(response.status)
  }
  check('rate limiter blocks further requests in the window', statuses.includes(202) && statuses.at(-1) === 429 && statuses.filter(status => status === 202).length <= 5, statuses)
  await closeInstance()

  // Backup and restore drill on the same database.
  const backupResult = JSON.parse(execFileSync(process.execPath, [path.join(root, 'backend', 'durable-backup.mjs'), 'backup', dbPath, backupPath], { encoding: 'utf8' }))
  check('online backup produced a checksum', /^[a-f0-9]{64}$/.test(backupResult.sha256) && fs.statSync(backupPath).size > 0, backupResult)
  const restoreResult = JSON.parse(execFileSync(process.execPath, [path.join(root, 'backend', 'durable-backup.mjs'), 'restore', backupPath, restorePath, backupResult.sha256], { encoding: 'utf8' }))
  check('restore verifies checksum and integrity into a new path', /^[a-f0-9]{64}$/.test(restoreResult.sha256), restoreResult)
  const restoredDb = new DatabaseSync(restorePath, { readOnly: true })
  try {
    const leads = restoredDb.prepare('SELECT count(*) n FROM leads').get().n
    const sent = restoredDb.prepare("SELECT count(*) n FROM outbox WHERE status='sent'").get().n
    const quarantined = restoredDb.prepare("SELECT count(*) n FROM outbox WHERE status='unknown'").get().n
    const docs = restoredDb.prepare('SELECT count(*) n FROM documents').get().n
    check('restored database keeps leads, sent receipts and document hashes', leads >= 5 && sent >= 1 && quarantined >= 1 && docs === 3, { leads, sent, quarantined, docs })
  } finally { restoredDb.close() }
  check('no secrets or token text in the drilled files', !fs.readFileSync(dbPath).includes(Buffer.from('MAX_BOT_TOKEN')), 'binary scan')
} catch (error) {
  report.failures.push(`drill error: ${error.message}`)
} finally {
  try { await closeInstance() } catch {}
}
report.finishedAt = new Date().toISOString()
report.ok = report.failures.length === 0
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'durable-drill.json'), JSON.stringify(report, null, 1))
console.log(JSON.stringify({ ok: report.ok, steps: report.steps.length, failures: report.failures }, null, 1))
process.exit(report.ok ? 0 : 1)
