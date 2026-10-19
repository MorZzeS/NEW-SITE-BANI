'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { WorksLightbox, type WorksPhoto } from './WorksLightbox'

export function InteractivePhotoGallery({ photos, compact = false, ariaLabel }: { photos: WorksPhoto[]; compact?: boolean; ariaLabel: string }) {
  const [active, setActive] = useState<number | null>(null)
  const close = useCallback(() => setActive(null), [])
  const visible = compact ? photos.slice(0, 4) : photos

  return (
    <>
      <div className="project-photo-grid">
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="project-photo-thumb"
            aria-label={`Открыть фотографию ${index + 1}: ${photo.alt}`}
            aria-haspopup="dialog"
            onClick={() => setActive(index)}
          >
            <Image
              src={photo.thumbnail}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes={compact ? '(max-width: 760px) 42vw, 22vw' : '(max-width: 760px) 42vw, 23vw'}
              style={{ objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%` }}
            />
            <span className="project-photo-number">{index + 1}</span>
          </button>
        ))}
      </div>
      {compact && photos.length > visible.length && (
        <button type="button" className="project-gallery-all" onClick={() => setActive(0)}>
          Открыть все фотографии · {photos.length}
        </button>
      )}
      {active !== null && <WorksLightbox photos={photos} initialIndex={active} onClose={close} />}
      <span className="sr-only" aria-live="polite">{ariaLabel}</span>
    </>
  )
}
