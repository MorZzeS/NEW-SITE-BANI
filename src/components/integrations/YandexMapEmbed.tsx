'use client'

import { type CSSProperties } from 'react'
import { ExternalLink, MapPinned } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { releasePolicy } from '@/lib/release-policy'

const YANDEX_HOSTS = ['yandex.ru', 'yandex.com', 'yandex.com.tr'] as const

function trustedYandexUrl(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    const trustedHost = YANDEX_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`))
    return url.protocol === 'https:' && trustedHost && !url.username && !url.password && !url.port ? url.toString() : null
  } catch {
    return null
  }
}

function trustedYandexMapWidgetUrl(value?: string) {
  const safe = trustedYandexUrl(value)
  if (!safe) return null
  const url = new URL(safe)
  const keys = [...url.searchParams.keys()].sort()
  return url.hostname === 'yandex.ru'
    && url.pathname === '/map-widget/v1/'
    && !url.hash
    && keys.join(',') === 'oid,ol,z'
    && url.searchParams.get('ol') === 'biz'
    && url.searchParams.get('oid') === '68540156780'
    && url.searchParams.get('z') === '16'
    ? url.toString()
    : null
}

export type YandexMapEmbedProps = {
  /** Owner-approved HTTPS Yandex Maps embed URL. Coordinates are never inferred. */
  embedUrl?: string
  /** Optional owner-approved public map URL shown below the embed. */
  mapUrl?: string
  /** Route destination verified from the owner-provided public map. */
  routeUrl?: string
  title?: string
  className?: string
}

/**
 * Yandex Map loads automatically when the approved embed URL is present. An embed URL is intentionally required from the
 * caller so the site cannot publish unverified coordinates or an invented venue.
 */
export function YandexMapEmbed({
  embedUrl,
  mapUrl,
  routeUrl,
  title = 'Как нас найти',
  className = '',
}: YandexMapEmbedProps) {
  const { theme } = useTheme()
  const safeEmbedUrl = releasePolicy.embeddedYandex === 'automatic' ? trustedYandexMapWidgetUrl(embedUrl) : null
  const safeMapUrl = trustedYandexUrl(mapUrl)
  const safeRouteUrl = trustedYandexUrl(routeUrl)
  const style = { '--integration-accent': 'var(--color-accent)' } as CSSProperties

  return (
    <section
      aria-labelledby="yandex-map-title"
      data-theme-mode={theme}
      className={`glass rounded-[var(--radius-lg)] p-5 sm:p-6 ${className}`.trim()}
      style={style}
    >
      <div className="flex items-center gap-3">
        <MapPinned aria-hidden="true" size={22} className="shrink-0 text-[var(--integration-accent)]" />
        <h2 id="yandex-map-title" className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      </div>

      {safeEmbedUrl ? (
        <div className="mt-5 min-h-[280px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-dark)] sm:min-h-[360px]">
          <iframe
            src={safeEmbedUrl}
            title={title}
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="block h-[280px] w-full border-0 sm:h-[360px]"
          />
        </div>
      ) : (
        <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg-dark)] p-5 text-center text-sm text-[var(--color-text-muted)]">
          <p>Карта и маршрут открываются на сайте Яндекса по ссылкам ниже. Переход ведёт во внешний сервис.</p>
        </div>
      )}

      {safeMapUrl ? (
        <a
          href={safeMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
        >
          Открыть карту на Яндексе
          <ExternalLink aria-hidden="true" size={15} />
        </a>
      ) : null}
      {safeRouteUrl && <a href={safeRouteUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-[var(--color-text)] underline underline-offset-4">Построить маршрут<ExternalLink aria-hidden="true" size={15} /></a>}
    </section>
  )
}
