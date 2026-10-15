'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import works from '@/data/real-works.json'
import { WorksLightbox, type WorksPhoto } from '../ui/WorksLightbox'
import './real-works.css'

export function RealWorksGallery({ limit }: { limit?: number }) {
  const [active, setActive] = useState<number | null>(null)
  const close = useCallback(() => setActive(null), [])
  const groups = works.groups.filter(group => group.visible).sort((a, b) => a.order - b.order).map(group => ({
    ...group,
    media: group.media.filter(photo => photo.visible).sort((a, b) => {
      if (a.id === group.coverMediaId) return -1
      if (b.id === group.coverMediaId) return 1
      return a.order - b.order
    }),
  }))
  const photos: WorksPhoto[] = groups.flatMap(group => group.media)
  const shownIds = new Set((limit ? photos.slice(0, limit) : photos).map(photo => photo.id))

  if (!shownIds.size) return <p className="text-cream/60">Фотографии скоро появятся.</p>

  return (
    <>
      {groups.map(group => {
        const shown = group.media.filter(photo => shownIds.has(photo.id))
        if (!shown.length) return null
        return (
          <section key={group.id} className="mb-10 last:mb-0" aria-labelledby={`works-${group.id}`}>
            <h2 id={`works-${group.id}`} className="text-xl font-semibold text-cream mb-3">{group.title}</h2>
            {group.description && <p className="text-sm text-cream/60 max-w-2xl mb-6">{group.description}</p>}
            <div className="real-works-grid">
              {shown.map(photo => (
                <button key={photo.id} type="button" className="real-works-card glass-card" onClick={() => setActive(photos.findIndex(item => item.id === photo.id))} aria-label={`Открыть фотографию: ${photo.alt}`} aria-haspopup="dialog">
                  <span className="real-works-image">
                    <Image src={photo.thumbnail} alt={photo.alt} fill loading="lazy" sizes="(min-width: 1024px) 33vw, (min-width: 560px) 50vw, 100vw" style={{ objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%` }} />
                    <span className="real-works-open" aria-hidden="true">Смотреть фото ↗</span>
                  </span>
                  {photo.caption && <span className="real-works-caption">{photo.caption}</span>}
                </button>
              ))}
            </div>
          </section>
        )
      })}
      {active !== null && <WorksLightbox photos={photos} initialIndex={active} onClose={close} />}
    </>
  )
}
