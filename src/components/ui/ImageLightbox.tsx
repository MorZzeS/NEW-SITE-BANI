'use client'

import { useState, useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  alt?: string
}

export function ImageLightbox({ images, alt = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = (i: number) => { setIndex(i); setOpen(true); document.body.style.overflow = 'hidden' }
  const close = () => { setOpen(false); document.body.style.overflow = '' }

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  return (
    <>
      {images.map((src, i) => (
        <button
          key={src}
          onClick={() => openAt(i)}
          className="group block relative aspect-[4/3] rounded-2xl overflow-hidden cursor-zoom-in"
          aria-label={`Открыть фото ${i + 1}`}
        >
          <img src={src} alt={`${alt} — фото ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/60 via-transparent to-transparent pointer-events-none" />
        </button>
      ))}
      {open && (
        <div className="fixed inset-0 z-[100] bg-graphite-950/90 backdrop-blur-md flex items-center justify-center" onClick={close}>
          <button className="absolute top-5 right-5 text-cream hover:text-gold-300 z-10" onClick={close} aria-label="Закрыть"><X size={32} /></button>
          <button className="absolute left-5 top-1/2 -translate-y-1/2 text-cream hover:text-gold-300 z-10" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Назад"><ChevronLeft size={48} /></button>
          <button className="absolute right-5 top-1/2 -translate-y-1/2 text-cream hover:text-gold-300 z-10" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Вперёд"><ChevronRight size={48} /></button>
          <img src={images[index]} alt={`${alt} — фото ${index + 1}`} className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-cream/60 bg-graphite-900/60 px-3 py-1 rounded-full">{index + 1} / {images.length}</div>
        </div>
      )}
    </>
  )
}
