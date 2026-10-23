import type { Lead } from './leads'

// Tab-session lifetime only: no names, phones, page URLs or payload hashes in storage.
// A pending marker becomes unresolved on reload. There is deliberately no automatic expiry
// or UI reset for ambiguous delivery: the operator must reconcile using this request ID.
const storageKey = 'banger:lead-v3-attempt'
export type AttemptMarker = { requestId: string; state: 'pending' | 'unknown' | 'claimed' | 'conflict' | 'sent' }
let frozen: Readonly<Lead> | undefined
let memoryMarker: AttemptMarker | undefined
let rejected = false
const identity = (lead: Lead) => JSON.stringify(Object.keys(lead).filter(key => !['requestId', 'createdAt', 'startedAt'].includes(key)).sort().map(key => [key, lead[key as keyof Lead]]))
export function leadAttemptMarker(): AttemptMarker | undefined {
  if (memoryMarker) return memoryMarker
  if (typeof window === 'undefined') return undefined
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return undefined
    const marker = JSON.parse(raw)
    if (typeof marker.requestId !== 'string' || !/^[A-Za-z0-9_-]{16,80}$/.test(marker.requestId) || !['pending', 'unknown', 'claimed', 'conflict', 'sent'].includes(marker.state)) throw new Error('Invalid marker')
    return { requestId: marker.requestId, state: marker.state === 'pending' ? 'unknown' : marker.state }
  } catch { return { requestId: '', state: 'unknown' } }
}
export function beginLeadAttempt(candidate: Lead): Readonly<Lead> {
  if (leadAttemptMarker()) throw new Error('Статус предыдущей заявки требует проверки. Повторная отправка отключена; свяжитесь с нами и назовите номер попытки.')
  if (frozen && (!rejected || identity(frozen) !== identity(candidate))) throw new Error('Для повтора сохранена исходная заявка. Верните исходные поля или свяжитесь с нами напрямую.')
  const payload = frozen || Object.freeze({ ...candidate })
  const marker: AttemptMarker = { requestId: payload.requestId, state: 'pending' }
  try { sessionStorage.setItem(storageKey, JSON.stringify(marker)) } catch { throw new Error('Для безопасной отправки требуется доступ к хранилищу текущей вкладки. Свяжитесь с нами напрямую.') }
  frozen = payload
  memoryMarker = marker
  rejected = false
  return payload
}
export function settleLeadAttempt(state: AttemptMarker['state'] | 'rejected') {
  if (!frozen) return
  if (state === 'rejected') {
    rejected = true
    // Only a matching explicit server confirmation of non-admission can remove the lock.
    try { sessionStorage.removeItem(storageKey); memoryMarker = undefined } catch { memoryMarker = { requestId: frozen.requestId, state: 'unknown' } }
    return
  }
  memoryMarker = { requestId: frozen.requestId, state }
  try { sessionStorage.setItem(storageKey, JSON.stringify(memoryMarker)) } catch { /* Original pending marker still protects a reload. */ }
}
export function discardRejectedLeadAttempt() {
  if (!rejected || leadAttemptMarker()) return false
  frozen = undefined
  rejected = false
  return true
}
