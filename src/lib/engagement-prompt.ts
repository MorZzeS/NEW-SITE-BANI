export const ENGAGEMENT_PROMPT_SESSION_KEY = 'banger:engagement-prompt:shown'

export function wasEngagementPromptShown(): boolean {
  try { return window.sessionStorage.getItem(ENGAGEMENT_PROMPT_SESSION_KEY) === '1' }
  catch { return false }
}

export function markEngagementPromptShown(): void {
  try { window.sessionStorage.setItem(ENGAGEMENT_PROMPT_SESSION_KEY, '1') }
  catch { /* Component-local guards still prevent repeat display while mounted. */ }
}
