import { readAnalyticsConsent } from '@/lib/analytics-consent'
import { releasePolicy } from '@/lib/release-policy'

/** Only the counter explicitly approved by the owner may be initialized. */
export function approvedMetrikaId(): number {
  if (!releasePolicy.analytics) return 0
  return process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() === '111684946' ? 111684946 : 0
}

export type AnalyticsGoal =
  | 'form_submit'
  | 'lead_success'
  | 'click_phone'
  | 'click_max'
  | 'click_telegram'
  | 'open_gallery'
  | 'select_model'
  | 'click_vk'
  | 'click_instagram'
  | 'configure_option'
  | 'configure_reset'
  | 'configure_request'

/**
 * Analytics stays inert until an owner-approved Yandex Metrika ID and script
 * are configured. No form fields, phone numbers, comments or request IDs are
 * ever included in goal parameters.
 */
export function trackGoal(goal: AnalyticsGoal) {
  if (!releasePolicy.analytics) return
  if (typeof window === 'undefined') return
  if (!readAnalyticsConsent()?.analytics) return
  const counterId = approvedMetrikaId()
  const ym = (window as Window & { ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void }).ym
  if (!counterId || typeof ym !== 'function') return
  ym(counterId, 'reachGoal', goal)
}
