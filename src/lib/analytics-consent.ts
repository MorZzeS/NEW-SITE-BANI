export const ANALYTICS_CONSENT_EVENT = 'banger-consent-change'
export const ANALYTICS_CONSENT_STORAGE_KEY = 'banger-consent-v1'

export type AnalyticsConsent = {
  analytics: boolean
  version: 1
}

function isAnalyticsConsent(value: unknown): value is AnalyticsConsent {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AnalyticsConsent>
  return candidate.version === 1 && typeof candidate.analytics === 'boolean'
}

/**
 * Consent contains only the visitor's technical choice. It must never contain
 * a name, phone number, comment, request id, or any other lead data.
 */
export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isAnalyticsConsent(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeAnalyticsConsent(analytics: boolean): AnalyticsConsent {
  const consent: AnalyticsConsent = { analytics, version: 1 }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, JSON.stringify(consent))
    } catch {
      // Private browsing and blocked storage should not prevent site usage.
    }
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }))
  }
  return consent
}

export function clearAnalyticsConsent() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
  } catch {
    // Ignore unavailable storage; the in-memory UI can still be updated.
  }
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: null }))
}
