'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
export type WorksPhoto = { id: string; src: string; thumbnail: string; alt: string; caption: string; width: number; height: number; focalPoint: { x: number; y: number } }
export function WorksLightbox({ photos, initialIndex, onClose }: { photos: WorksPhoto[]; initialIndex: number; onClose: () => void }) {
  const [index,setIndex] = useState(initialIndex)
  const dialog = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const touch = useRef<{x:number;y:number} | null>(null)
  const photo = photos[index]
  const move = (step:number) => setIndex(value => (value+step+photos.length)%photos.length)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    const keydown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setIndex(value => (value-1+photos.length)%photos.length) }
      if (event.key === 'ArrowRight') { event.preventDefault(); setIndex(value => (value+1)%photos.length) }
      if (event.key === 'Tab') {
        const buttons = dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        if (!buttons?.length) return
        const first = buttons[0], last = buttons[buttons.length-1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown',keydown)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown',keydown); previous?.focus() }
  },[onClose,photos.length])
  return createPortal(<div className="works-lightbox" onClick={event => {if(event.target === event.currentTarget) onClose()}}><div ref={dialog} className="works-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Просмотр фотографий работ" aria-describedby="works-photo-caption"><button ref={close} type="button" className="works-lightbox-close" aria-label="Закрыть просмотр" onClick={onClose}><X aria-hidden="true" /></button><div className="works-lightbox-stage" onTouchStart={event => {const point = event.touches[0]; touch.current = {x:point.clientX,y:point.clientY}}} onTouchEnd={event => {if(!touch.current) return; const dx=event.changedTouches[0].clientX-touch.current.x,dy=event.changedTouches[0].clientY-touch.current.y; if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)) move(dx<0?1:-1); touch.current=null}}>
  {/* Full image source is only mounted while the viewer is open. */}
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img key={photo.id} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="works-lightbox-photo" /></div><div className="works-lightbox-footer"><button type="button" aria-label="Предыдущая фотография" onClick={() => move(-1)} disabled={photos.length<2}><ChevronLeft aria-hidden="true" /></button><div id="works-photo-caption" className="works-lightbox-caption" aria-live="polite" aria-atomic="true"><p>{photo.caption || photo.alt}</p><span>{index+1} / {photos.length}</span></div><button type="button" aria-label="Следующая фотография" onClick={() => move(1)} disabled={photos.length<2}><ChevronRight aria-hidden="true" /></button></div></div></div>,document.body)
}
