'use client'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { homeInteriors } from '@/data/home-interiors'

export function InteriorLightbox({ index, onChange, onClose }: { index: number; onChange: (index: number) => void; onClose: () => void }) {
  const reducedMotion = useReducedMotion()
  const dialog = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const go = useCallback((direction: number) => onChange((index + direction + homeInteriors.length) % homeInteriors.length), [index, onChange])
  const goRef = useRef(go)
  goRef.current = go
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); goRef.current(event.key === 'ArrowRight' ? 1 : -1) }
      if (event.key === 'Tab') {
        const buttons = dialog.current?.querySelectorAll<HTMLButtonElement>('button')
        if (!buttons?.length) return
        const first = buttons[0], last = buttons[buttons.length - 1]
        if (!dialog.current?.contains(document.activeElement)) { event.preventDefault(); first.focus() }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', keyboard)
    return () => { window.removeEventListener('keydown', keyboard); document.body.style.overflow = overflow; opener?.focus({ preventScroll: true }) }
  }, [onClose])
  const photo = homeInteriors[index]
  return createPortal(<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .18 }} ref={dialog} role="dialog" aria-modal="true" aria-label="Галерея интерьеров" className="interior-lightbox" onClick={onClose}>
    <button ref={close} className="interior-lightbox-close gallery-control" aria-label="Закрыть галерею" onClick={onClose}><X size={22} /></button>
    <div className="interior-lightbox-panel" onClick={event => event.stopPropagation()}>
      <div className="interior-lightbox-image" onPointerDown={event => { pointer.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) }} onPointerCancel={() => { pointer.current = null }} onPointerUp={event => {
        if (!pointer.current) return
        const dx = pointer.current.x - event.clientX, dy = pointer.current.y - event.clientY
        pointer.current = null
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx > 0 ? 1 : -1)
      }}>
        <picture key={photo.src}><source srcSet={photo.avif} type="image/avif" /><img src={photo.src} alt={photo.alt} draggable={false} /></picture>
      </div>
      <div className="interior-lightbox-toolbar">
        <button className="gallery-control" aria-label="Предыдущее фото интерьера" onClick={() => go(-1)}><ChevronLeft size={22} /></button>
        <div aria-live="polite"><p>{photo.caption}</p><span>{index + 1} / {homeInteriors.length}</span></div>
        <button className="gallery-control" aria-label="Следующее фото интерьера" onClick={() => go(1)}><ChevronRight size={22} /></button>
      </div>
    </div>
  </motion.div>, document.body)
}
