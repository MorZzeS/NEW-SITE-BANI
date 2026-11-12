'use client'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { withBasePath } from '@/lib/site-path'
import { useReducedMotion } from 'framer-motion'

export type GalleryItem = {
  src: string
  type: 'MAIN' | 'PLAN' | 'MODEL_PHOTO' | 'INTERIOR_REAL' | 'INTERIOR_EXAMPLE'
  alt: string
  label?: string
  aspectRatio?: number
}

interface Props {
  items: GalleryItem[]
  title?: string
  compact?: boolean
}

function GalleryImage({ item, priority = false, full = false, contain = false, onAspectRatio }: { item: GalleryItem; priority?: boolean; full?: boolean; contain?: boolean; onAspectRatio?: (ratio: number) => void }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const imageRef = useRef<HTMLImageElement>(null)
  const settleImage = useCallback((image: HTMLImageElement) => {
    if (!image.complete) return
    if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
      setStatus('error')
      return
    }
    setStatus('ready')
    onAspectRatio?.(image.naturalWidth / image.naturalHeight)
  }, [onAspectRatio])
  useEffect(() => {
    const image = imageRef.current
    if (image?.complete) settleImage(image)
  }, [item.src, settleImage])
  return <>
    <Image ref={imageRef} draggable={false} src={withBasePath(item.src)} alt={item.alt} fill priority={priority}
      loading={priority ? 'eager' : 'lazy'} sizes={full ? '90vw' : '(max-width: 768px) 100vw, 80vw'}
      onLoad={(event) => settleImage(event.currentTarget)} onError={() => setStatus('error')}
      className={`${full || contain || item.type === 'PLAN' || item.type === 'INTERIOR_EXAMPLE' ? 'object-contain' : 'object-cover'} ${item.type === 'PLAN' && !full ? 'bg-white' : contain || item.type === 'INTERIOR_EXAMPLE' ? 'bg-graphite-950' : ''} ${item.type === 'INTERIOR_EXAMPLE' ? 'product-gallery-interior-image' : ''} ${status === 'error' ? 'invisible' : ''}`} />
    {status !== 'ready' && <span role="status" className="theme-on-image absolute inset-0 flex items-center justify-center px-16 text-center text-sm text-white bg-graphite-950/60 pointer-events-none">
      {status === 'error' ? 'Изображение недоступно. Выберите другой кадр или обновите страницу.' : item.type === 'PLAN' ? 'Загружаем планировку…' : 'Загружаем изображение…'}
    </span>}
  </>
}

export function ProductGallery({ items: sourceItems, title, compact = false }: Props) {
  const items = useMemo(() => sourceItems.filter((item, i) => sourceItems.findIndex((other) => other.src === item.src) === i), [sourceItems])
  const [current, setCurrent] = useState(0)
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({})
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const interiorCarousel = items.some(item => item.type === 'INTERIOR_EXAMPLE')
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

  const goByUser = useCallback((dir: number) => {
    setAutoplayEnabled(false)
    go(dir)
  }, [go])

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState === 'visible')
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    if (!interiorCarousel || !autoplayEnabled || prefersReducedMotion || hovered || focused || lightbox || !documentVisible || items.length < 2) return
    const timer = window.setInterval(() => go(1), 6000)
    return () => window.clearInterval(timer)
  }, [autoplayEnabled, documentVisible, focused, go, hovered, interiorCarousel, items.length, lightbox, prefersReducedMotion])

  useEffect(() => {
    if (!lightbox) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goByUser(-1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); goByUser(1) }
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
  }, [goByUser, lightbox])

  const currentItem = items.length ? items[current % items.length] : undefined
  const observedAspectRatio = currentItem ? imageRatios[currentItem.src] ?? currentItem.aspectRatio ?? (currentItem.type === 'PLAN' ? 4 / 3 : 3 / 2) : 3 / 2
  const portraitInterior = currentItem?.type === 'INTERIOR_EXAMPLE' && observedAspectRatio < 1
  const currentAspectRatio = currentItem?.type === 'INTERIOR_EXAMPLE' ? undefined : observedAspectRatio
  const rememberAspectRatio = useCallback((ratio: number) => {
    if (!Number.isFinite(ratio) || ratio <= 0) return
    if (!currentItem) return
    setImageRatios(previous => previous[currentItem.src] === ratio ? previous : { ...previous, [currentItem.src]: ratio })
  }, [currentItem?.src])
  if (!currentItem) return null
  const touchHandlers = {
    onPointerDown: (e: React.PointerEvent) => { swipeRef.current = e.clientX; swipeYRef.current = e.clientY; swipedRef.current = false },
    onPointerUp: (e: React.PointerEvent) => {
      if (swipeRef.current === null) return
      const diff = swipeRef.current - e.clientX
      const vertical = swipeYRef.current - e.clientY
      swipeRef.current = null
      if (Math.abs(diff) > 40 && Math.abs(diff) > Math.abs(vertical) * 1.5 && !single) { swipedRef.current = true; goByUser(diff > 0 ? 1 : -1) }
    },
    onPointerCancel: () => { swipeRef.current = null },
  }

  return (
    <div role="region" aria-label={compact ? "Фото модели" : title || "Галерея"} className={`${compact ? '' : 'mb-16'} ${interiorCarousel ? 'interior-gallery' : ''}`} data-gallery-autoplay={interiorCarousel ? (autoplayEnabled && !prefersReducedMotion ? 'enabled' : 'paused') : undefined} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false) }}>
      {compact && <h2 className="sr-only">Галерея модели</h2>}
      {!compact && <h2 className="text-2xl font-bold text-cream mb-6">{title || 'Галерея'}</h2>}

      {/* Main image viewer */}
      <div className="product-gallery-stage">
        {!single && (
          <button
            onClick={() => goByUser(-1)}
            aria-label="Назад"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
          <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {!single && (
          <button
            onClick={() => goByUser(1)}
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
          className={`block w-full relative cursor-pointer select-none touch-pan-y ${interiorCarousel ? 'interior-gallery-image' : ''}`}
          style={{ aspectRatio: currentAspectRatio }}
          onClick={() => { if (!swipedRef.current) { setAutoplayEnabled(false); setLightbox(true) }; swipedRef.current = false }}
          {...touchHandlers}
        >
          <GalleryImage key={currentItem.src} item={currentItem} priority={current === 0 && !interiorCarousel} contain={portraitInterior} onAspectRatio={rememberAspectRatio} />
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

      {interiorCarousel && items.length > 1 && <div className="product-gallery-autoplay-row">
        <span aria-live="polite">{prefersReducedMotion ? 'Автопрокрутка отключена настройками анимации' : autoplayEnabled ? 'Автопрокрутка включена' : 'Автопрокрутка на паузе'}</span>
        <button type="button" className="product-gallery-autoplay-button" aria-pressed={autoplayEnabled && !prefersReducedMotion} disabled={Boolean(prefersReducedMotion)} onClick={() => setAutoplayEnabled(value => !value)}>
          {autoplayEnabled && !prefersReducedMotion ? <Pause aria-hidden="true" size={15} /> : <Play aria-hidden="true" size={15} />}
          {autoplayEnabled && !prefersReducedMotion ? 'Пауза' : 'Продолжить'}
        </button>
      </div>}

      {/* Thumbnails */}
      {!single && <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => { setAutoplayEnabled(false); setCurrent(i) }}
            aria-label={`Перейти к ${i + 1}`}
            className={`relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border transition-opacity ${
              i === current ? 'border-gold-400' : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <Image src={withBasePath(item.src)} alt={item.alt} fill className={item.type === 'PLAN' ? 'object-contain bg-white' : 'object-cover'} loading="lazy" />
          </button>
        ))}
      </div>}

      {/* Lightbox */}
      {lightbox && createPortal(
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={currentItem.alt} className="fixed inset-0 z-[100] bg-graphite-950/95 flex items-center justify-center p-4" onClick={() => setLightbox(false)} {...touchHandlers}>
          <button ref={closeRef} onClick={() => setLightbox(false)} className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20" aria-label="Закрыть">×</button>
          {!single && <>
            <button aria-label="Предыдущее фото" onClick={(e) => { e.stopPropagation(); goByUser(-1) }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-graphite-950/70 text-white flex items-center justify-center hover:bg-white/20">‹</button>
            <button aria-label="Следующее фото" onClick={(e) => { e.stopPropagation(); goByUser(1) }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-graphite-950/70 text-white flex items-center justify-center hover:bg-white/20">›</button>
          </>}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">{current + 1} / {items.length}</div>
          <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <GalleryImage key={currentItem.src} item={currentItem} full />
          </div>
        </div>, document.body
      )}
    </div>
  )
}
