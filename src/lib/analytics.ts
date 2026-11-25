import { readAnalyticsConsent } from '@/lib/analytics-consent'
import { releasePolicy } from '@/lib/release-policy'

/** Only the counter explicitly approved by the owner may be initialized. */
export function approvedMetrikaId(): number {
  if (!releasePolicy.analytics) return 0
  return process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() === '111684946' ? 111684946 : 0
}

export type AnalyticsGoal = 'lead_success' | 'phone_click' | 'max_click' | 'telegram_click' | 'calculator_start' | 'pdf_download' | 'model_view' | 'project_view'

type YandexCommand = (id: number, action: string, goal: string, params?: Record<string, unknown>) => void
let initialized = false
const pendingGoals: AnalyticsGoal[] = []

/** Analytics is restricted to the production HTTPS host even if a build is misconfigured. */
export function isProductionAnalyticsHost(hostname: string, protocol: string): boolean {
  return protocol === 'https:' && (hostname === 'banger.su' || hostname === 'www.banger.su')
}

function mayTrack(): boolean {
  return releasePolicy.analytics && typeof window !== 'undefined'
    && isProductionAnalyticsHost(window.location.hostname, window.location.protocol)
    && Boolean(approvedMetrikaId()) && readAnalyticsConsent()?.analytics === true
}

function sendGoal(goal: AnalyticsGoal) {
  const ym = (window as Window & { ym?: YandexCommand }).ym
  const counterId = approvedMetrikaId()
  if (counterId && typeof ym === 'function') ym(counterId, 'reachGoal', goal)
}

/** Queues only allowlisted goal names in memory while the tag is loading. */
export function setAnalyticsInitialized(value: boolean) {
  initialized = value
  if (!value) {
    pendingGoals.length = 0
    return
  }
  if (!mayTrack()) {
    initialized = false
    pendingGoals.length = 0
    return
  }
  for (const goal of pendingGoals.splice(0)) sendGoal(goal)
}

export function clearPendingAnalyticsGoals() {
  pendingGoals.length = 0
}

/**
 * No form fields, phone numbers, comments, addresses, amounts, model names,
 * or request IDs are included in goals.
 */
export function trackGoal(goal: AnalyticsGoal) {
  if (!mayTrack()) return
  if (initialized) sendGoal(goal)
  else if (pendingGoals.length < 100) pendingGoals.push(goal)
}
