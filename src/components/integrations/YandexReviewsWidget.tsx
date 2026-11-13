'use client'

import { type CSSProperties } from 'react'
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
    return url.protocol === 'https:' && trustedHost && !url.username && !url.password && !url.port ? url.toString() : null
  } catch {
    return null
  }
}

function trustedReviewsWidgetUrl(value?: string) {
  const safe = trustedYandexUrl(value)
  if (!safe) return null
  const url = new URL(safe)
  const keys = [...url.searchParams.keys()]
  return url.hostname === 'yandex.ru'
    && url.pathname === '/maps-reviews-widget/68540156780'
    && !url.hash
    && keys.length === 1
    && keys[0] === 'comments'
    && url.searchParams.get('comments') === ''
    ? url.toString()
    : null
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
 * Yandex Reviews loads automatically when the approved Yandex widget URL is present.
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
  const safeBusinessUrl = trustedYandexUrl(businessUrl)
  const safeEmbedUrl = releasePolicy.embeddedYandex === 'automatic' ? trustedReviewsWidgetUrl(embedUrl) : null
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

      {themedEmbedUrl ? (
        <div
          role="region"
          aria-label="Отзывы Яндекса — прокручиваемый список"
          tabIndex={0}
          data-yandex-reviews-scroll
          className="mt-5 box-border h-[500px] max-w-[760px] overflow-y-auto overflow-x-hidden rounded-[var(--radius-md)] border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
        >
          <iframe
            key={themedEmbedUrl}
            src={themedEmbedUrl}
            title="Отзывы о Бани Герасимов на Яндексе"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-[1200px] w-full border-0"
          />
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--radius-md)] border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg-dark)] p-5 text-sm text-[var(--color-text-muted)]">
          <p>Отзывы доступны на сайте Яндекса. По ссылке ниже вы перейдёте во внешний сервис.</p>
        </div>
      )}

      {themedEmbedUrl && <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">Прокрутите список, чтобы увидеть остальные отзывы. Полный список и сортировка по дате доступны на Яндексе.</p>}

      {safeBusinessUrl ? (
        <a
          href={safeBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--glass-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
        >
          Все отзывы на Яндексе
          <ExternalLink aria-hidden="true" size={15} />
        </a>
      ) : null}
    </section>
  )
}
