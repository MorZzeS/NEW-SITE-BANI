type ReleaseDocument = { version?: unknown; text?: unknown; sha256?: unknown }
type ReleaseBundle = { approved?: unknown; documents?: unknown } | null | undefined

/**
 * A configured HTTPS endpoint alone must never activate a public lead form.
 * Contract 3 and the complete reviewed document bundle are required as well.
 * Hash contents are verified asynchronously by OnlineLeadForm before enabling submit.
 */
export function isOnlineLeadReleaseReady(endpoint: string | undefined, contract: string | undefined, bundle: ReleaseBundle): boolean {
  if (contract !== '3' || bundle?.approved !== true || !bundle.documents || typeof bundle.documents !== 'object' || Array.isArray(bundle.documents)) return false
  const docs = bundle.documents as Record<string, ReleaseDocument>
  if (Object.keys(docs).sort().join(',') !== 'checkbox,consent,policy') return false
  for (const kind of ['checkbox', 'consent', 'policy']) {
    const document = docs[kind]
    if (!document || typeof document !== 'object' || typeof document.version !== 'string' || !document.version || typeof document.text !== 'string' || !document.text || typeof document.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(document.sha256)) return false
  }
  try {
    const target = new URL(endpoint || '')
    return target.origin === 'https://banger.su' && target.pathname === '/leads.php' && !target.username && !target.password && !target.search && !target.hash
  } catch {
    return false
  }
}
