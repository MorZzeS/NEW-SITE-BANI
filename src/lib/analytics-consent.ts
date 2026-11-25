export const ANALYTICS_CONSENT_EVENT = 'banger-consent-change'
export const ANALYTICS_CONSENT_STORAGE_KEY = 'banger-consent-v3'
export const ANALYTICS_CONSENT_CHANNEL = 'banger-analytics-consent'
const ANALYTICS_CONSENT_VERSION = 3 as const
const ANALYTICS_DENIAL_SESSION_KEY = 'banger-analytics-denied'
const ANALYTICS_DENIAL_COOKIE = 'banger-analytics-denied'
const ANALYTICS_DENIAL_MAX_AGE = 60 * 60 * 24 * 365
const ANALYTICS_CONSENT_MAX_AGE_MS = ANALYTICS_DENIAL_MAX_AGE * 1000
const ANALYTICS_STORAGE_PROBE_KEY = 'banger-analytics-consent-storage-check'

export type AnalyticsConsent = {
  analytics: boolean
  behaviorReplay: boolean
  version: typeof ANALYTICS_CONSENT_VERSION
  updatedAt: string
}

/** Consent-change events are authoritative for the current tab; unknown data always means off. */
export function analyticsAllowedFromConsentEvent(detail: unknown): boolean {
  return Boolean(detail && typeof detail === 'object' && (detail as { analytics?: unknown }).analytics === true)
}

/** A consent event may start tracking only when the choice is also persisted. */
export function analyticsConsentEventAllowsLoading(detail: unknown, stored: AnalyticsConsent | null): boolean {
  if (!analyticsAllowedFromConsentEvent(detail) || !stored?.analytics) return false
  if (!detail || typeof detail !== 'object') return false
  const event = detail as Partial<AnalyticsConsent>
  return event.version === stored.version
    && event.updatedAt === stored.updatedAt
    && event.behaviorReplay === stored.behaviorReplay
}

/** A tab that observed an explicit refusal must not resume from a stale stored grant. */
export function canResumeAnalyticsForTab(revokedInThisTab: boolean, consent: AnalyticsConsent | null): boolean {
  return !revokedInThisTab && consent?.analytics === true
}

function isAnalyticsConsent(value: unknown): value is AnalyticsConsent {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AnalyticsConsent>
  if (candidate.version !== ANALYTICS_CONSENT_VERSION
    || typeof candidate.analytics !== 'boolean'
    || typeof candidate.behaviorReplay !== 'boolean'
    || (candidate.behaviorReplay && !candidate.analytics)
    || typeof candidate.updatedAt !== 'string') return false
  const age = Date.now() - Date.parse(candidate.updatedAt)
  return Number.isFinite(age) && age <= ANALYTICS_CONSENT_MAX_AGE_MS && age >= -24 * 60 * 60 * 1000
}

function hasAnalyticsDenialMarker(): boolean {
  if (typeof window === 'undefined') return false
  try { if (window.sessionStorage.getItem(ANALYTICS_DENIAL_SESSION_KEY) === '1') return true } catch { /* cookie fallback below */ }
  try {
    return window.document.cookie.split(';').some(value => value.trim() === `${ANALYTICS_DENIAL_COOKIE}=1`)
  } catch { return false }
}

function setAnalyticsSessionDenialMarker(): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.sessionStorage.setItem(ANALYTICS_DENIAL_SESSION_KEY, '1')
    return window.sessionStorage.getItem(ANALYTICS_DENIAL_SESSION_KEY) === '1'
  } catch { return false }
}

function setAnalyticsDenialCookie(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    window.document.cookie = `${ANALYTICS_DENIAL_COOKIE}=1; Max-Age=${ANALYTICS_DENIAL_MAX_AGE}; Path=/; SameSite=Lax${secure}`
    return window.document.cookie.split(';').some(value => value.trim() === `${ANALYTICS_DENIAL_COOKIE}=1`)
  } catch { return false }
}

function setAnalyticsDenialMarker(): boolean {
  setAnalyticsSessionDenialMarker()
  return setAnalyticsDenialCookie()
}

function broadcastConsentChange(kind: 'revoked' | 'changed'): void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return
  try {
    const channel = new BroadcastChannel(ANALYTICS_CONSENT_CHANNEL)
    channel.postMessage({ kind })
    channel.close()
  } catch { /* storage and the current-tab event remain the fallback */ }
}

function clearAnalyticsDenialMarker(): boolean {
  if (typeof window === 'undefined') return false
  try { window.sessionStorage.removeItem(ANALYTICS_DENIAL_SESSION_KEY) } catch { /* verify remaining marker below */ }
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    window.document.cookie = `${ANALYTICS_DENIAL_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`
  } catch { /* verify remaining marker below */ }
  return !hasAnalyticsDenialMarker()
}

/** A cross-tab refusal applies to this tab immediately, even if persistent storage is blocked. */
export function markAnalyticsRevokedInCurrentTab(): void {
  setAnalyticsSessionDenialMarker()
}

/** A deliberate later opt-in in another tab may clear this tab's session-only refusal. */
export function clearAnalyticsSessionRevocation(): void {
  if (typeof window === 'undefined') return
  try { window.sessionStorage.removeItem(ANALYTICS_DENIAL_SESSION_KEY) } catch { /* fail closed in this tab */ }
}

function isConsentStorageWritable(): boolean {
  try {
    window.localStorage.setItem(ANALYTICS_STORAGE_PROBE_KEY, '1')
    window.localStorage.removeItem(ANALYTICS_STORAGE_PROBE_KEY)
    return true
  } catch {
    try { window.localStorage.removeItem(ANALYTICS_STORAGE_PROBE_KEY) } catch { /* remain fail-closed */ }
    return false
  }
}

/**
 * Consent contains only the visitor's technical choice. It must never contain
 * a name, phone number, comment, request id, or any other lead data.
 */
export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null
  if (!isConsentStorageWritable()) return null
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isAnalyticsConsent(parsed)) return null
    // Keep a persisted refusal visible to the consent UI, while a denial marker
    // still overrides any stale opt-in that could otherwise restart tracking.
    return hasAnalyticsDenialMarker() && parsed.analytics ? null : parsed
  } catch {
    return null
  }
}

export function writeAnalyticsConsent(analytics: boolean, behaviorReplay = false): boolean {
  const consent: AnalyticsConsent = { analytics, behaviorReplay: analytics && behaviorReplay, version: ANALYTICS_CONSENT_VERSION, updatedAt: new Date().toISOString() }
  if (typeof window !== 'undefined') {
    if (analytics && !clearAnalyticsDenialMarker()) {
      window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: null }))
      broadcastConsentChange('revoked')
      return false
    }
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, JSON.stringify(consent))
    } catch {
      // Fail closed: without a saved explicit choice the counter stays disabled.
      // A durable denial marker also prevents any prior opt-in from being reused after reload.
      try {
        window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
      } catch { /* current tab still fails closed */ }
      const denialCookieSaved = setAnalyticsDenialMarker()
      window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: null }))
      broadcastConsentChange('revoked')
      if (!analytics && denialCookieSaved) return true
      return false
    }
    if (!analytics) setAnalyticsDenialMarker()
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }))
    broadcastConsentChange(analytics ? 'changed' : 'revoked')
    return true
  }
  return false
}

export function clearAnalyticsConsent() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
  } catch {
    // Ignore unavailable storage; the in-memory UI can still be updated.
  }
  setAnalyticsDenialMarker()
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: null }))
  broadcastConsentChange('revoked')
}
