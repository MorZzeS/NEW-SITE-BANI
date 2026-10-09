/** New consent evidence is opt-in only after operator approval of both documents. */
export const leadContract = process.env.NEXT_PUBLIC_LEADS_CONTRACT === '2' ? 2 : 1
export const consentVersion = process.env.NEXT_PUBLIC_CONSENT_VERSION || ''
export const policyVersion = process.env.NEXT_PUBLIC_POLICY_VERSION || ''
export const consentEvidenceReady = leadContract === 1 || Boolean(consentVersion && policyVersion)
export function leadPageUrl(raw: string) {
  if (leadContract === 1) return raw
  const url = new URL(raw)
  return url.origin + url.pathname
}
export function consentEvidence() {
  return leadContract === 2 ? { contractVersion: 2, consentVersion, policyVersion } : {}
}
