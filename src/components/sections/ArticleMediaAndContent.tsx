'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import type { Article } from '@/types'
import { withBasePath } from '@/lib/site-path'

type HeroImage = {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

type Props = {
  presentation: NonNullable<Article['presentation']>
  hero?: HeroImage
  title: string
  html: string
}

type ZoomState = { src: string; alt: string; trigger: HTMLElement } | null

export function ArticleMediaAndContent({ presentation, hero, title, html }: Props) {
  const [zoom, setZoom] = useState<ZoomState>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (zoom && !dialog.open) dialog.showModal()
    if (!zoom && dialog.open) dialog.close()
    if (zoom) closeRef.current?.focus()
  }, [zoom])

  const openFrom = (button: HTMLButtonElement) => {
    const rawSrc = button.dataset.articleZoom
    const allowedPrefix = withBasePath('/images/articles/')
    if (!rawSrc || !rawSrc.startsWith(allowedPrefix) || rawSrc.startsWith('//') || rawSrc.includes('\\')) return
    const imageUrl = new URL(rawSrc, window.location.origin)
    if (imageUrl.origin !== window.location.origin || !imageUrl.pathname.startsWith(allowedPrefix) || imageUrl.search || imageUrl.hash) return
    setZoom({ src: imageUrl.pathname, alt: button.dataset.articleAlt || title, trigger: button })
  }

  const close = () => {
    const trigger = zoom?.trigger
    setZoom(null)
    requestAnimationFrame(() => {
      if (trigger?.isConnected) trigger.focus()
    })
  }

  return (
    <div
      className={`article-media-content article-media-content--${presentation}`}
      onClick={(event) => {
        const target = event.target as HTMLElement
        const button = target.closest<HTMLButtonElement>('button[data-article-zoom]')
        if (button && event.currentTarget.contains(button)) openFrom(button)
      }}
    >
      {hero && <figure className="article-hero-figure">
        <button
          type="button"
          className="article-image-zoom"
          data-article-zoom={withBasePath(hero.src)}
          data-article-alt={hero.alt}
          aria-label={`Увеличить изображение: ${hero.alt}`}
        >
          <img src={withBasePath(hero.src)} alt={hero.alt} width={hero.width} height={hero.height} fetchPriority="high" />
          <span className="article-image-zoom-label"><ZoomIn aria-hidden="true" /> Увеличить</span>
        </button>
        {hero.caption && <figcaption>{hero.caption}</figcaption>}
      </figure>}

      {html && <article
        className={`article-body glass rounded-3xl p-5 sm:p-8 text-cream article-body--${presentation}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />}

      <dialog
        ref={dialogRef}
        className="article-image-dialog"
        aria-label={`Увеличенное изображение: ${zoom?.alt || title}`}
        onCancel={(event) => { event.preventDefault(); close() }}
        onClose={() => setZoom(null)}
        onClick={(event) => { if (event.target === event.currentTarget) close() }}
      >
        {zoom && <div className="article-image-dialog-panel">
          <button ref={closeRef} type="button" className="article-image-dialog-close" onClick={close} aria-label="Закрыть изображение">
            <X aria-hidden="true" />
          </button>
          <img src={zoom.src} alt={zoom.alt} />
          <p>{zoom.alt}</p>
        </div>}
      </dialog>
    </div>
  )
}
