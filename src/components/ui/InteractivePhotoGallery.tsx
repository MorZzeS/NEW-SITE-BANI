'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { WorksLightbox, type WorksPhoto } from './WorksLightbox'
import { withBasePath } from '@/lib/site-path'

export function InteractivePhotoGallery({ photos, compact = false, featured = false, ariaLabel }: { photos: WorksPhoto[]; compact?: boolean; featured?: boolean; ariaLabel: string }) {
  const [active, setActive] = useState<number | null>(null)
  const close = useCallback(() => setActive(null), [])
  const visible = featured ? photos.slice(0, 1) : compact ? photos.slice(0, 4) : photos
  const layout = visible.length === 1 ? 'single' : visible.length === 2 || (!compact && visible.length >= 4 && visible.length % 2 === 0) ? 'paired' : 'multiple'
  const plans = visible.every(photo => photo.kind === 'plan')

  if (!visible.length) return null

  return (
    <>
      <div className={`project-photo-grid project-photo-grid--${layout}${compact ? ' project-photo-grid--compact' : ''}${featured ? ' project-photo-grid--featured' : ''}${plans ? ' project-photo-grid--plans' : ''}`} role="group" aria-label={ariaLabel}>
        {visible.map((photo, index) => (
          <figure className="project-photo-item" key={photo.id}>
          <button
            type="button"
            className={`project-photo-thumb${photo.kind === 'plan' ? ' project-photo-thumb--plan' : photo.width < photo.height ? ' project-photo-thumb--portrait' : ''}`}
            aria-label={`Открыть ${photo.kind === 'plan' ? 'планировку' : photo.kind === 'catalog-render' ? 'визуализацию' : photo.kind === 'reference' ? 'материал проекта' : 'фотографию'} ${index + 1}: ${photo.alt}`}
            aria-haspopup="dialog"
            onClick={() => setActive(index)}
          >
            <Image
              src={withBasePath(featured ? photo.src : photo.thumbnail)}
              alt={photo.alt}
              fill
              priority={featured}
              loading={featured ? undefined : 'lazy'}
              sizes={featured ? '(max-width: 960px) 100vw, 760px' : compact ? '(max-width: 760px) 46vw, 23vw' : visible.length === 1 ? '(max-width: 1280px) 100vw, 1216px' : '(max-width: 559px) 100vw, (max-width: 960px) 46vw, 600px'}
              style={{ objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%`, objectFit: photo.kind === 'plan' || photo.width < photo.height ? 'contain' : 'cover' }}
            />
            <span className="project-photo-number" aria-hidden="true">{featured ? `Открыть${photos.length > 1 ? ` галерею · ${photos.length}` : ''} ↗` : `${index + 1} ↗`}</span>
          </button>
          {!compact && <figcaption className="project-photo-caption">{photo.caption || photo.alt}</figcaption>}
          </figure>
        ))}
      </div>
      {compact && photos.length > visible.length && (
        <button type="button" className="project-gallery-all" onClick={() => setActive(0)}>
          Открыть все фотографии · {photos.length}
        </button>
      )}
      {active !== null && <WorksLightbox photos={photos} initialIndex={active} onClose={close} />}
    </>
  )
}
