import { leadDocumentBundle, type LeadDocumentBundle } from '../data/lead-documents'
/** Contract 3 additionally needs one complete static document bundle; ENV cannot approve it. */
export const leadContract = process.env.NEXT_PUBLIC_LEADS_CONTRACT === '3' ? 3 : process.env.NEXT_PUBLIC_LEADS_CONTRACT === '2' ? 2 : 1
export const consentVersion = process.env.NEXT_PUBLIC_CONSENT_VERSION || ''
export const policyVersion = process.env.NEXT_PUBLIC_POLICY_VERSION || ''
export const consentEvidenceReady = leadContract === 1 || (leadContract === 2 ? Boolean(consentVersion && policyVersion) : leadDocumentBundle.approved === true && Boolean(leadDocumentBundle.documents))
export { leadDocumentBundle }
export function documentBundleIdentity(bundle: LeadDocumentBundle) { try { return JSON.stringify(bundle) } catch { return 'invalid-bundle' } }
export async function verifyLeadDocumentBundle(bundle: LeadDocumentBundle = leadDocumentBundle) {
  if (bundle?.approved !== true || !bundle.documents || !globalThis.crypto?.subtle) throw new Error('Документы для новой системы заявок ещё не утверждены или их проверка недоступна.')
  if (typeof bundle.documents !== 'object' || Array.isArray(bundle.documents) || Object.keys(bundle.documents).sort().join(',') !== 'checkbox,consent,policy') throw new Error('Неполный пакет документов для заявки.')
  const snapshot = {} as NonNullable<LeadDocumentBundle['documents']>
  for (const kind of ['consent', 'checkbox', 'policy'] as const) {
    const document = bundle.documents[kind]
    if (!document || typeof document !== 'object' || Array.isArray(document) || Object.keys(document).sort().join(',') !== 'sha256,text,version' || typeof document.text !== 'string' || typeof document.version !== 'string' || typeof document.sha256 !== 'string') throw new Error('Не удалось проверить документы для заявки.')
    Object.assign(snapshot, { [kind]: Object.freeze({ version: document.version, text: document.text, sha256: document.sha256 }) })
  }
  Object.freeze(snapshot)
  for (const document of Object.values(snapshot)) {
    const bytes = new TextEncoder().encode(document.text)
    if (!/^[A-Za-z0-9._-]{1,80}$/.test(document.version) || bytes.length < 1 || bytes.length > 262144 || !/^[a-f0-9]{64}$/.test(document.sha256) || new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes) !== document.text) throw new Error('Не удалось проверить документы для заявки.')
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('')
    if (digest !== document.sha256) throw new Error('Текст документов изменился. Отправка отключена.')
  }
  return snapshot
}
export function leadPageUrl(raw: string) {
  if (leadContract === 1) return raw
  const url = new URL(raw)
  return url.origin + url.pathname
}
export function consentEvidence(verifiedDocuments?: NonNullable<LeadDocumentBundle['documents']>) {
  if (leadContract === 3) {
    const docs = verifiedDocuments || leadDocumentBundle.documents
    if (leadDocumentBundle.approved !== true || !docs) throw new Error('Документы для новой системы заявок ещё не утверждены.')
    return { contractVersion: 3, purposeCode: 'inquiry_response' as const, action: 'unchecked_checkbox_then_submit' as const,
      consentVersion: docs.consent.version, checkboxVersion: docs.checkbox.version, policyVersion: docs.policy.version,
      consentTextSha256: docs.consent.sha256, checkboxTextSha256: docs.checkbox.sha256, policyTextSha256: docs.policy.sha256 }
  }
  return leadContract === 2 ? { contractVersion: 2, consentVersion, policyVersion } : {}
}
