'use client'
import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type GalleryItem = {
  src: string
  type: 'MAIN' | 'PLAN' | 'MODEL_PHOTO' | 'INTERIOR_REAL' | 'INTERIOR_EXAMPLE'
  alt: string
  label?: string
}

interface Props {
  items: GalleryItem[]
  title?: string
}

export function ProductGallery({ items, title }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const single = items.length <= 1

  const go = useCallback((dir: number) => {
    setCurrent((c) => {
      const next = (c + dir + items.length) % items.length
      return next
    })
  }, [items.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  if (!items || items.length === 0) return null

  const currentItem = items[current]

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-cream mb-6">{title || 'Галерея'}</h2>

      {/* Main image viewer */}
      <div className="relative rounded-3xl overflow-hidden glass-card mb-4">
        {!single && (
          <button
            onClick={() => go(-1)}
            aria-label="Назад"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-graphite-950/60 text-cream flex items-center justify-center hover:bg-graphite-950/80 transition-colors"
          >
          <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {!single && (
          <button
            onClick={() => go(1)}
            aria-label="Вперёд"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-graphite-950/60 text-cream flex items-center justify-center hover:bg-graphite-950/80 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          className="relative aspect-[4/3] md:aspect-[16/10] cursor-pointer select-none"
          onClick={() => setLightbox(true)}
          onTouchStart={(e) => { (window as any)._swipeStart = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            const start = (window as any)._swipeStart || 0
            const end = e.changedTouches[0].clientX
            const diff = start - end
            if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1)
          }}
        >
          <Image
            src={currentItem.src}
            alt={currentItem.alt}
            fill
            priority={current === 0}
            loading={current === 0 ? 'eager' : 'lazy'}
            className={currentItem.type === 'PLAN' ? 'object-contain' : 'object-cover'}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          {currentItem.label && (
            <div className="absolute bottom-3 left-3 bg-graphite-950/70 backdrop-blur px-3 py-1 rounded-xl text-xs text-cream/90 border border-white/10">
              {currentItem.label}
            </div>
          )}
          {!single && (
            <div className="absolute top-3 right-3 bg-graphite-950/70 backdrop-blur px-2.5 py-1 rounded-lg text-xs text-cream/80 border border-white/10">
              {current + 1} / {items.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Перейти к ${i + 1}`}
            className={`relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all ${
              i === current ? 'border-gold-400 ring-2 ring-gold-400/30' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={item.src} alt={item.alt} fill className={item.type === 'PLAN' ? 'object-contain' : 'object-cover'} loading="lazy" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-graphite-950/95 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20" aria-label="Закрыть">×</button>
          <button onClick={(e) => { e.stopPropagation(); go(-1) }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20">‹</button>
          <button onClick={(e) => { e.stopPropagation(); go(1) }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20">›</button>
          <Image src={currentItem.src} alt={currentItem.alt} fill className={currentItem.type === 'PLAN' ? 'object-contain' : 'object-cover'} sizes="100vw" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
