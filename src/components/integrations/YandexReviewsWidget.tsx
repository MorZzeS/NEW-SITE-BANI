'use client'

import { useState, type CSSProperties } from 'react'
import { ExternalLink, Star } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { releasePolicy } from '@/lib/release-policy'

const YANDEX_HOSTS = ['yandex.ru', 'yandex.com', 'yandex.com.tr'] as const

function trustedYandexUrl(value?: string) {
  if (!value) return null
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    const trustedHost = YANDEX_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`))
    return url.protocol === 'https:' && trustedHost ? url.toString() : null
  } catch {
    return null
  }
}

export type YandexReviewsWidgetProps = {
  /** HTTPS URL of the published Yandex Business review page. */
  businessUrl?: string
  /** Optional HTTPS URL of an owner-approved Yandex review widget embed. */
  embedUrl?: string
  title?: string
  description?: string
  className?: string
}

/**
 * A deliberately opt-in Yandex Reviews surface.
 *
 * No business URL is guessed here: until the owner supplies an approved URL the
 * component renders a clear placeholder and makes no third-party request.
 */
export function YandexReviewsWidget({
  businessUrl,
  embedUrl,
  title = 'Отзывы клиентов',
  description = 'Посмотрите отзывы о банях Герасимов на Яндексе.',
  className = '',
}: YandexReviewsWidgetProps) {
  const { theme } = useTheme()
  const [loaded, setLoaded] = useState(false)
  const safeBusinessUrl = trustedYandexUrl(businessUrl)
  const safeEmbedUrl = releasePolicy.embeddedYandex ? trustedYandexUrl(embedUrl) : null
  const themedEmbedUrl = safeEmbedUrl ? (() => {
    const url = new URL(safeEmbedUrl)
    url.searchParams.set('theme', theme === 'light' ? 'light' : 'dark')
    return url.toString()
  })() : null
  const style = { '--integration-accent': 'var(--color-accent)' } as CSSProperties

  return (
    <section
      aria-labelledby="yandex-reviews-title"
      data-theme-mode={theme}
      className={`glass rounded-[var(--radius-lg)] p-5 sm:p-6 ${className}`.trim()}
      style={style}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="section-tag mb-2">Репутация</p>
          <h2 id="yandex-reviews-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
        <Star aria-hidden="true" size={22} className="shrink-0 text-[var(--integration-accent)]" />
      </div>

      {themedEmbedUrl && loaded ? (
        <div className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-dark)]">
          <iframe
            key={themedEmbedUrl}
            src={themedEmbedUrl}
            title="Отзывы о Бани Герасимов на Яндексе"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-[500px] w-full border-0"
          />
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-md)] border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg-dark)] p-5 text-sm text-[var(--color-text-muted)]">
          <p>{themedEmbedUrl ? 'Отзывы загружаются с серверов Яндекса после вашего нажатия.' : 'Отзывы доступны на сайте Яндекса. По ссылке ниже вы перейдёте во внешний сервис.'}</p>
          {themedEmbedUrl && <button type="button" className="btn-secondary mt-4 min-h-11" onClick={() => setLoaded(true)}>Загрузить отзывы Яндекса</button>}
        </div>
      )}

      {safeBusinessUrl ? (
        <a
          href={safeBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
        >
          Открыть отзывы и оставить отзыв на Яндексе
          <ExternalLink aria-hidden="true" size={15} />
        </a>
      ) : null}
    </section>
  )
}
