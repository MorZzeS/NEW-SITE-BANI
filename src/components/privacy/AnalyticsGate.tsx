'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ANALYTICS_CONSENT_CHANNEL, ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_STORAGE_KEY, analyticsConsentEventAllowsLoading, canResumeAnalyticsForTab, clearAnalyticsSessionRevocation, markAnalyticsRevokedInCurrentTab, readAnalyticsConsent } from '@/lib/analytics-consent'
import { analyticsRouteGoal, cleanInternalPath, safeAnalyticsPath, safeAnalyticsReferer } from '@/lib/analytics-path'
import { approvedMetrikaId, isProductionAnalyticsHost, setAnalyticsInitialized, trackGoal, type AnalyticsGoal } from '@/lib/analytics'

type YandexWindow = Window & {
  ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }
}

function linkGoal(href: string): AnalyticsGoal | null {
  try {
    const url = new URL(href, window.location.href)
    if (url.protocol === 'tel:') return 'phone_click'
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    if (['max.ru', 'web.max.ru'].includes(url.hostname) || url.hostname.endsWith('.max.ru')) return 'max_click'
    if (['t.me', 'telegram.me', 'www.telegram.me'].includes(url.hostname)) return 'telegram_click'
  } catch { return null }
  return null
}

export default function AnalyticsGate() {
  const pathname = usePathname()
  const initialized = useRef(false)
  const loading = useRef(false)
  const revokedInThisTab = useRef(false)
  const activeBehaviorReplay = useRef<boolean | null>(null)
  const requestedBehaviorReplay = useRef<boolean | null>(null)
  const currentPath = useRef<string | null>(null)
  const lastObservedPath = useRef<string | null>(null)
  const lastSentPath = useRef<string | null>(null)
  const lastSentRoute = useRef<string | null>(null)
  const routeQueue = useRef<string[]>([])
  const sendRoute = useRef<(route: string) => void>(() => undefined)

  useEffect(() => {
    const counterId = approvedMetrikaId()
    if (!counterId || !isProductionAnalyticsHost(window.location.hostname, window.location.protocol)) return
    const analyticsWindow = window as YandexWindow
    let script: HTMLScriptElement | null = null

    sendRoute.current = route => {
      if (!initialized.current || !readAnalyticsConsent()?.analytics) return
      const routePath = cleanInternalPath(route)
      if (lastSentRoute.current === routePath) return
      const path = safeAnalyticsPath(routePath)
      const previousPath = lastSentPath.current
      const referer = previousPath
        ? `${window.location.origin}${previousPath}`
        : safeAnalyticsReferer(document.referrer, window.location.origin)
      analyticsWindow.ym?.(counterId, 'hit', `${window.location.origin}${path}`, { title: 'Бани Герасимов', ...(referer ? { referer } : {}) })
      lastSentPath.current = path
      lastSentRoute.current = routePath
      const goal = analyticsRouteGoal(routePath)
      if (goal) trackGoal(goal)
    }

    const stop = (resetPageviewAfterRevocation = false) => {
      if (initialized.current) analyticsWindow.ym?.(counterId, 'destruct')
      initialized.current = false
      loading.current = false
      activeBehaviorReplay.current = null
      requestedBehaviorReplay.current = null
      routeQueue.current = []
      if (resetPageviewAfterRevocation) {
        lastSentPath.current = null
        lastSentRoute.current = null
      }
      setAnalyticsInitialized(false)
      if (script) {
        script.onload = null
        script.onerror = null
        script.remove()
        script = null
      }
      if (analyticsWindow.ym?.a) analyticsWindow.ym.a.length = 0
    }
    const start = () => {
      const consent = readAnalyticsConsent()
      if (!consent?.analytics) return
      const behaviorReplay = consent.behaviorReplay
      if (initialized.current || loading.current || script) {
        const currentMode = initialized.current ? activeBehaviorReplay.current : requestedBehaviorReplay.current
        if (currentMode === behaviorReplay) return
        stop()
      }
      loading.current = true
      requestedBehaviorReplay.current = behaviorReplay
      routeQueue.current = [currentPath.current || cleanInternalPath(window.location.pathname)]
      analyticsWindow.ym ??= Object.assign((...args: unknown[]) => {
        (analyticsWindow.ym!.a ??= []).push(args)
      }, { l: Date.now() })
      script = document.createElement('script')
      script.async = true
      script.referrerPolicy = 'no-referrer'
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      script.dataset.bangerAnalytics = 'yandex-metrika'
      script.onload = () => {
        loading.current = false
        const currentConsent = readAnalyticsConsent()
        if (!currentConsent?.analytics) { stop(true); return }
        if (!isProductionAnalyticsHost(window.location.hostname, window.location.protocol)) { stop(); return }
        if (currentConsent.behaviorReplay !== behaviorReplay) { stop(); start(); return }
        analyticsWindow.ym?.(counterId, 'init', {
          defer: true,
          webvisor: behaviorReplay,
          clickmap: behaviorReplay,
          trackLinks: false,
          accurateTrackBounce: false,
          trackHash: false,
          sendTitle: false,
        })
        initialized.current = true
        activeBehaviorReplay.current = behaviorReplay
        requestedBehaviorReplay.current = null
        setAnalyticsInitialized(true)
        const queuedRoutes = routeQueue.current.length ? routeQueue.current : [currentPath.current || cleanInternalPath(window.location.pathname)]
        routeQueue.current = []
        queuedRoutes.forEach(route => sendRoute.current(route))
      }
      script.onerror = () => stop()
      document.head.appendChild(script)
    }
    const sync = () => {
      const consent = readAnalyticsConsent()
      if (!consent || !canResumeAnalyticsForTab(revokedInThisTab.current, consent)) { stop(true); return }
      if (initialized.current && activeBehaviorReplay.current !== consent.behaviorReplay) stop()
      if (loading.current && requestedBehaviorReplay.current !== consent.behaviorReplay) stop()
      start()
    }
    const onConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail
      if (analyticsConsentEventAllowsLoading(detail, readAnalyticsConsent())) {
        revokedInThisTab.current = false
        start()
      } else {
        revokedInThisTab.current = true
        stop(true)
      }
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY && event.key !== null) return
      const choice = readAnalyticsConsent()
      revokedInThisTab.current = !choice?.analytics
      sync()
    }
    let consentChannel: BroadcastChannel | null = null
    const onConsentMessage = (event: MessageEvent<unknown>) => {
      if (!event.data || typeof event.data !== 'object') return
      const kind = (event.data as { kind?: unknown }).kind
      if (kind === 'revoked') {
        revokedInThisTab.current = true
        markAnalyticsRevokedInCurrentTab()
        stop(true)
      } else if (kind === 'changed') {
        revokedInThisTab.current = false
        clearAnalyticsSessionRevocation()
        sync()
      }
    }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement)) return
      const goal = linkGoal(link.href)
      if (goal) trackGoal(goal)
    }
    sync()
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        consentChannel = new BroadcastChannel(ANALYTICS_CONSENT_CHANNEL)
        consentChannel.addEventListener('message', onConsentMessage)
      } catch { consentChannel = null }
    }
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange)
    window.addEventListener('storage', onStorage)
    document.addEventListener('click', onClick, true)
    const consentSyncTimer = window.setInterval(sync, 1000)
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange)
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('click', onClick, true)
      window.clearInterval(consentSyncTimer)
      consentChannel?.removeEventListener('message', onConsentMessage)
      consentChannel?.close()
      stop()
    }
  }, [])

  useEffect(() => {
    const route = cleanInternalPath(pathname)
    currentPath.current = route
    if (lastObservedPath.current === route) return
    lastObservedPath.current = route
    if (!readAnalyticsConsent()?.analytics) return
    if (initialized.current && lastSentRoute.current !== route) sendRoute.current(route)
    else if (loading.current && routeQueue.current.at(-1) !== route) routeQueue.current.push(route)
  }, [pathname])

  return null
}
