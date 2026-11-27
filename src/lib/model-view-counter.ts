import { releasePolicy } from '@/lib/release-policy'

type Counts = Record<string, number>
let counts: Counts = {}
let countsLoaded = false
let loadPromise: Promise<void> | null = null
const listeners = new Set<() => void>()
const modelIdPattern = /^bg-\d{2}$/

function publish(next: Counts) {
  const merged = { ...counts }
  for (const [id, incoming] of Object.entries(next)) merged[id] = Math.max(merged[id] ?? 0, incoming)
  counts = merged
  for (const listener of listeners) listener()
}

function counterResponse(value: unknown): value is { ok: true; counts?: unknown; modelId?: unknown; views?: unknown } {
  return Boolean(value && typeof value === 'object' && 'ok' in value && value.ok === true)
}

export function subscribeModelViewCounts(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getModelViewCount(modelId: string): number | null {
  return Number.isSafeInteger(counts[modelId]) && counts[modelId] >= 0 ? counts[modelId] : null
}

export function loadModelViewCounts(): Promise<void> {
  if (!releasePolicy.modelViews || typeof window === 'undefined') return Promise.resolve()
  if (countsLoaded) return Promise.resolve()
  if (loadPromise) return loadPromise
  loadPromise = fetch('/model-views.php', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    headers: { Accept: 'application/json' },
  }).then(async response => {
    if (!response.ok) throw new Error('counts_unavailable')
    const data: unknown = await response.json()
    if (!counterResponse(data) || !('counts' in data) || !data.counts || typeof data.counts !== 'object' || Array.isArray(data.counts)) throw new Error('counts_invalid')
    const next: Counts = {}
    for (const [id, value] of Object.entries(data.counts)) {
      if (modelIdPattern.test(id) && Number.isSafeInteger(value) && (value as number) >= 0) next[id] = value as number
    }
    publish(next)
    countsLoaded = true
  }).catch(() => { loadPromise = null })
  return loadPromise
}

/** Count one model-page opening. No browser storage, cookies, visitor IDs or consent coupling. */
export function startModelViewTracking(modelId: string): void {
  if (!releasePolicy.modelViews || typeof window === 'undefined' || !modelIdPattern.test(modelId)) return
  void fetch('/model-views.php', {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'application/json; charset=utf-8', Accept: 'application/json' },
    body: JSON.stringify({ modelId }),
  }).then(async response => {
    if (!response.ok) throw new Error('view_not_recorded')
    const data: unknown = await response.json()
    if (!counterResponse(data) || data.modelId !== modelId || !Number.isSafeInteger(data.views) || (data.views as number) < 1) throw new Error('view_response_invalid')
    publish({ ...counts, [modelId]: data.views as number })
    countsLoaded = true
  }).catch(() => undefined)
}
