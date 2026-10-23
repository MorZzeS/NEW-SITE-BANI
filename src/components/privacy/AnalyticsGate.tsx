'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_STORAGE_KEY, readAnalyticsConsent } from '@/lib/analytics-consent'
import { approvedMetrikaId, trackGoal } from '@/lib/analytics'

type YandexWindow = Window & {
  ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }
}

function cleanUrl(value: string) {
  try {
    const url = new URL(value)
    return /^https?:$/.test(url.protocol) ? url.origin + url.pathname : ''
  } catch { return '' }
}

function pageview(counterId: number) {
  if (!readAnalyticsConsent()?.analytics) return
  ;(window as YandexWindow).ym?.(counterId, 'hit', cleanUrl(window.location.href), {
    title: 'BANGER.SU', referer: cleanUrl(document.referrer),
  })
}

export default function AnalyticsGate() {
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    const counterId = approvedMetrikaId()
    if (!counterId) return
    const analyticsWindow = window as YandexWindow
    let script: HTMLScriptElement | null = null

    const stop = () => {
      // Removing a script does not stop an already initialized counter.
      if (initialized.current) analyticsWindow.ym?.(counterId, 'destruct')
      initialized.current = false
      if (script) {
        script.onload = null
        script.onerror = null
        script.remove()
        script = null
      }
      // A pending library may finish downloading, but has no queued init/hit.
      if (analyticsWindow.ym?.a) analyticsWindow.ym.a.length = 0
    }
    const start = () => {
      if (initialized.current || script) return
      analyticsWindow.ym ??= Object.assign((...args: unknown[]) => {
        (analyticsWindow.ym!.a ??= []).push(args)
      }, { l: Date.now() })
      script = document.createElement('script')
      script.async = true
      script.referrerPolicy = 'no-referrer'
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      script.dataset.bangerAnalytics = 'yandex-metrika'
      script.onload = () => {
        if (!readAnalyticsConsent()?.analytics) { stop(); return }
        analyticsWindow.ym?.(counterId, 'init', {
          defer: true, webvisor: false, clickmap: false, trackLinks: false,
          accurateTrackBounce: false, trackHash: false,
        })
        initialized.current = true
        pageview(counterId)
      }
      script.onerror = stop
      document.head.appendChild(script)
    }
    const sync = () => { if (readAnalyticsConsent()?.analytics) start(); else stop() }
    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_CONSENT_STORAGE_KEY || event.key === null) sync()
    }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement)) return
      const url = new URL(link.href)
      if (url.protocol === 'tel:') trackGoal('click_phone')
      else if (['max.ru', 'web.max.ru'].includes(url.hostname)) trackGoal('click_max')
      else if (['t.me', 'telegram.me'].includes(url.hostname)) trackGoal('click_telegram')
      else if (['vk.ru', 'vk.com'].includes(url.hostname)) trackGoal('click_vk')
      else if (['instagram.com', 'www.instagram.com'].includes(url.hostname)) trackGoal('click_instagram')
    }
    sync()
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync)
    window.addEventListener('storage', onStorage)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync)
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('click', onClick, true)
      stop()
    }
  }, [])

  useEffect(() => {
    const counterId = approvedMetrikaId()
    if (counterId && initialized.current) pageview(counterId)
  }, [pathname])

  return null
}
