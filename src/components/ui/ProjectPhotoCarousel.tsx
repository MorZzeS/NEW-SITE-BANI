'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { withBasePath } from '@/lib/site-path'
import { WorksLightbox, type WorksPhoto } from './WorksLightbox'
import styles from './ProjectPhotoCarousel.module.css'

const wrap = (index: number, count: number) => (index + count) % count

export function ProjectPhotoCarousel({ photos, ariaLabel }: { photos: WorksPhoto[]; ariaLabel: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null)
  const dragged = useRef(false)
  const current = photos[active]
  const move = (step: number) => setActive(index => wrap(index + step, photos.length))

  if (!photos.length) return null

  function finishPointer(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current
    pointer.current = null
    if (!start || start.id !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
      dragged.current = true
      move(dx < 0 ? 1 : -1)
    }
  }

  return <>
    <div className={styles.carousel} role="region" tabIndex={0} aria-roledescription="карусель фотографий" aria-label={ariaLabel}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          move(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}>
      <div className={styles.stage}
        onPointerDown={event => {
          if (event.button !== 0) return
          dragged.current = false
          pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
          // Capture on the activated button (not the whole stage) so normal
          // pointer clicks still reach its onClick after the pointer is released.
          const captureTarget = event.target instanceof Element ? event.target.closest('button') : null
          ;(captureTarget ?? event.currentTarget).setPointerCapture(event.pointerId)
        }}
        onPointerUp={finishPointer}
        onPointerCancel={() => { pointer.current = null }}
        onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false } }}>
        {[-1, 0, 1].map(offset => {
          const index = wrap(active + offset, photos.length)
          const photo = photos[index]
          const label = photo.caption || photo.alt
          return <div key={`${photo.id}-${offset}`} className={styles.slide}
            style={{ '--offset': offset, '--depth': Math.abs(offset) } as CSSProperties}
            data-offset={offset} role="group" aria-roledescription="слайд" aria-label={`${index + 1} из ${photos.length}`}>
            <button type="button" className={styles.photoButton}
              aria-label={offset === 0 ? `Открыть фотографию ${index + 1}: ${label}` : `Показать фотографию ${index + 1}: ${label}`}
              aria-haspopup={offset === 0 ? 'dialog' : undefined}
              onClick={() => offset === 0 ? setLightbox(true) : setActive(index)}>
              <Image src={withBasePath(photo.thumbnail)} alt={photo.alt} fill
                sizes="(max-width: 767px) 82vw, 58vw" loading={offset === 0 ? 'eager' : 'lazy'}
                style={{ objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%`, objectFit: 'contain' }} />
              {offset === 0 && <span className={styles.caption}>{label}<span><Expand size={14} aria-hidden="true" /> Открыть фото</span></span>}
            </button>
          </div>
        })}
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.control} aria-label="Предыдущая фотография" onClick={() => move(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <p className={styles.counter} aria-live="polite" aria-atomic="true"><strong>{String(active + 1).padStart(2, '0')}</strong><span> / {photos.length}</span></p>
        <button type="button" className={styles.control} aria-label="Следующая фотография" onClick={() => move(1)}><ChevronRight size={20} aria-hidden="true" /></button>
      </div>
      <p className={styles.currentCaption}>{current.caption || current.alt}</p>
    </div>
    {lightbox && <WorksLightbox photos={photos} initialIndex={active} onClose={() => setLightbox(false)} />}
  </>
}
