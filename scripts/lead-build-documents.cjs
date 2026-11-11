const fs = require('node:fs')
const { createHash } = require('node:crypto')

const documentKinds = ['checkbox', 'consent', 'policy']
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')

function exactKeys(value, keys) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).sort().join(',') === keys.join(',')
}

// The release build and the PHP handler consume the same pinned UTF-8 archive.
// Only the reviewed document snapshots are included in the client bundle.
function readLeadBuildDocuments(env) {
  if (!env.NEXT_PUBLIC_LEADS_ENDPOINT) return { approved: false, documents: null }
  if (env.NEXT_PUBLIC_LEADS_ENDPOINT !== 'https://banger.su/leads.php' || env.NEXT_PUBLIC_LEADS_CONTRACT !== '3') {
    throw new Error('Online leads require the reviewed SpaceWeb endpoint and contract 3')
  }
  const file = env.BANGER_LEAD_DOCUMENTS_FILE
  const pin = env.BANGER_LEAD_DOCUMENTS_SHA256
  if (!file || !/^[a-f0-9]{64}$/.test(pin || '')) throw new Error('Online leads require a pinned approved document archive')
  const stat = fs.lstatSync(file)
  if (!stat.isFile() || stat.size > 800000) throw new Error('Invalid lead document archive')
  const bytes = fs.readFileSync(file)
  if (sha256(bytes) !== pin) throw new Error('Lead document archive SHA256 mismatch')
  const bundle = JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes))
  if (!exactKeys(bundle, ['approved', 'documents']) || bundle.approved !== true || !exactKeys(bundle.documents, documentKinds)) {
    throw new Error('Incomplete or unapproved lead document archive')
  }
  for (const kind of documentKinds) {
    const doc = bundle.documents[kind]
    if (!exactKeys(doc, ['sha256', 'text', 'version']) || typeof doc.version !== 'string'
        || !/^[A-Za-z0-9._-]{1,80}$/.test(doc.version) || typeof doc.text !== 'string' || !doc.text
        || doc.text.includes('\0') || Buffer.byteLength(doc.text) > 262144
        || Buffer.from(doc.text).toString('utf8') !== doc.text || sha256(doc.text) !== doc.sha256) {
      throw new Error(`Invalid ${kind} text, version or SHA256 in lead document archive`)
    }
  }
  return bundle
}

module.exports = { readLeadBuildDocuments }
