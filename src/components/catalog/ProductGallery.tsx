'use client'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
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
  compact?: boolean
}

export function ProductGallery({ items: sourceItems, title, compact = false }: Props) {
  const items = useMemo(() => sourceItems.filter((item, i) => sourceItems.findIndex((other) => other.src === item.src) === i), [sourceItems])
  const [current, setCurrent] = useState(0)
  const swipeRef = useRef<number | null>(null)
  const swipeYRef = useRef(0)
  const swipedRef = useRef(false)
  const openerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState(false)

  const single = items.length <= 1

  const go = useCallback((dir: number) => {
    setCurrent((c) => {
      const next = items.length ? (c + dir + items.length) % items.length : 0
      return next
    })
  }, [items.length])

  useEffect(() => {
    if (!lightbox) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button')
        if (!buttons?.length) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      openerRef.current?.focus({ preventScroll: true })
    }
  }, [go, lightbox])

  if (!items || items.length === 0) return null

  const currentItem = items[current % items.length]
  const touchHandlers = {
    onPointerDown: (e: React.PointerEvent) => { swipeRef.current = e.clientX; swipeYRef.current = e.clientY; swipedRef.current = false },
    onPointerUp: (e: React.PointerEvent) => {
      if (swipeRef.current === null) return
      const diff = swipeRef.current - e.clientX
      const vertical = swipeYRef.current - e.clientY
      swipeRef.current = null
      if (Math.abs(diff) > 40 && Math.abs(diff) > Math.abs(vertical) * 1.5 && !single) { swipedRef.current = true; go(diff > 0 ? 1 : -1) }
    },
    onPointerCancel: () => { swipeRef.current = null },
  }

  return (
    <div role="region" aria-label={compact ? "Фото модели" : title || "Галерея"} className={compact ? "" : "mb-16"}>
      {compact && <h2 className="sr-only">Галерея модели</h2>}
      {!compact && <h2 className="text-2xl font-bold text-cream mb-6">{title || 'Галерея'}</h2>}

      {/* Main image viewer */}
      <div className="relative rounded-xl overflow-hidden glass mb-4">
        {!single && (
          <button
            onClick={() => go(-1)}
            aria-label="Назад"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
          <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {!single && (
          <button
            onClick={() => go(1)}
            aria-label="Вперёд"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <button
          ref={openerRef}
          type="button"
          aria-label={`Открыть ${currentItem.type === 'PLAN' ? 'планировку' : 'фото'}: ${currentItem.alt}`}
          className={`block w-full relative aspect-[4/3] ${compact ? '' : 'md:aspect-[16/10]'} cursor-pointer select-none touch-pan-y`}
          onClick={() => { if (!swipedRef.current) setLightbox(true); swipedRef.current = false }}
          {...touchHandlers}
        >
          <Image
            draggable={false}
            src={currentItem.src}
            alt={currentItem.alt}
            fill
            priority={current === 0}
            loading={current === 0 ? 'eager' : 'lazy'}
            className={['PLAN', 'MAIN', 'MODEL_PHOTO'].includes(currentItem.type) ? 'object-contain' : 'object-cover'}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          {currentItem.label && (
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-xl text-xs text-white/90 border border-white/10">
              {currentItem.label}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-lg text-xs text-white/80 border border-white/10">
            {current + 1} / {items.length}
          </div>
        </button>
      </div>

      {/* Thumbnails */}
      {!single && <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Перейти к ${i + 1}`}
            className={`relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all ${
              i === current ? 'border-gold-400 ring-2 ring-gold-400/30' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={item.src} alt={item.alt} fill className={['PLAN', 'MAIN', 'MODEL_PHOTO'].includes(item.type) ? 'object-contain' : 'object-cover'} loading="lazy" />
          </button>
        ))}
      </div>}

      {/* Lightbox */}
      {lightbox && createPortal(
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={currentItem.alt} className="fixed inset-0 z-[100] bg-graphite-950/95 flex items-center justify-center p-4" onClick={() => setLightbox(false)} {...touchHandlers}>
          <button ref={closeRef} onClick={() => setLightbox(false)} className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20" aria-label="Закрыть">×</button>
          {!single && <>
            <button aria-label="Предыдущее фото" onClick={(e) => { e.stopPropagation(); go(-1) }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-graphite-950/70 text-white flex items-center justify-center hover:bg-white/20">‹</button>
            <button aria-label="Следующее фото" onClick={(e) => { e.stopPropagation(); go(1) }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-graphite-950/70 text-white flex items-center justify-center hover:bg-white/20">›</button>
          </>}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">{current + 1} / {items.length}</div>
          <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image draggable={false} src={currentItem.src} alt={currentItem.alt} fill className="object-contain" sizes="90vw" />
          </div>
        </div>, document.body
      )}
    </div>
  )
}
