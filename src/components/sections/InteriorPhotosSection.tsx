'use client'
import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { homeInteriors } from '@/data/home-interiors'
import { InteriorLightbox } from '@/components/ui/InteriorLightbox'

export function InteriorPhotosSection() {
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const dragged = useRef(false)
  const [current, setCurrent] = useState<number | null>(null)
  const close = useCallback(() => setCurrent(null), [])
  const scroll = (direction: number) => {
    const element = track.current
    if (!element) return
    const width = element.firstElementChild?.getBoundingClientRect().width ?? 300
    element.scrollBy({ left: direction * (width + 16), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <section className="py-20">
    <div className="site-container">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div><span className="section-tag text-xs px-3 py-1.5 mb-3 inline-block">Реальные фото</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-cream leading-tight">Как выглядит<br className="hidden sm:block" /> наша баня внутри</h2>
          <p className="mt-3 text-cream/60 text-base max-w-xl">Собственные фотографии реализованных объектов — парная, моечная, комната отдыха, водоснабжение и отделка.</p>
        </div>
        <Link href="/katalog/bani" className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap self-start sm:self-auto">Смотреть каталог</Link>
      </div>
      <div className="interior-carousel" ref={track} role="region" aria-label="Фотографии интерьеров" tabIndex={0}
        onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); scroll(event.key === 'ArrowRight' ? 1 : -1) } }}
        onPointerDown={event => { if (event.pointerType !== 'mouse' || event.button !== 0) return; drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft }; dragged.current = false }}
        onPointerMove={event => {
          if (event.pointerType !== 'mouse') return
          if (!drag.current || event.buttons !== 1) { drag.current = null; event.currentTarget.classList.remove('is-dragging'); return }
          const dx = event.clientX - drag.current.x
          if (Math.abs(dx) > 6) { dragged.current = true; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.classList.add('is-dragging') }
          if (dragged.current) event.currentTarget.scrollLeft = drag.current.left - dx
        }}
        onPointerUp={event => { drag.current = null; event.currentTarget.classList.remove('is-dragging') }}
        onPointerCancel={event => { drag.current = null; event.currentTarget.classList.remove('is-dragging') }}
        onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false } }}>
        {homeInteriors.map((photo, index) => <button key={photo.src} type="button" className="interior-carousel-card" aria-label={`Открыть фото интерьера: ${photo.caption}, ${index + 1} из ${homeInteriors.length}`} onClick={() => setCurrent(index)}>
          <picture><source srcSet={photo.avif} type="image/avif" /><img src={photo.src} alt={photo.alt} width={1400} height={1050} loading="lazy" draggable={false} /></picture>
          <span>{photo.caption}</span>
        </button>)}
      </div>
      <div className="flex items-center justify-between gap-4 mt-4"><p className="text-xs text-cream/50">Варианты исполнения интерьера — конкретная комплектация согласуется при заказе</p><div className="flex gap-2 shrink-0">
        <button className="gallery-control" aria-label="Прокрутить фотографии назад" onClick={() => scroll(-1)}><ChevronLeft size={20} /></button>
        <button className="gallery-control" aria-label="Прокрутить фотографии вперёд" onClick={() => scroll(1)}><ChevronRight size={20} /></button>
      </div></div>
    </div>
    <AnimatePresence>{current !== null && <InteriorLightbox index={current} onChange={setCurrent} onClose={close} />}</AnimatePresence>
  </section>
}
