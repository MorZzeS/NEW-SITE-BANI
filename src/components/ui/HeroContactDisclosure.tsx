'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { SocialBlock } from './SocialBlock'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export function HeroContactDisclosure() {
  const [open, setOpen] = useState(false)
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 1023px)').matches) return
    panel.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [open, reducedMotion])
  return <div className="hero-contact-disclosure" onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); trigger.current?.focus() } }}>
    <button ref={trigger} type="button" className="hero-video-action hero-contact-trigger w-full" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}><MessageCircle aria-hidden="true" size={18} /><span>Мы на связи</span><ChevronDown aria-hidden="true" size={16} strokeWidth={2} className="hero-contact-chevron" /></button>
    <AnimatePresence initial={false}>{open && <motion.div ref={panel} id={id} className="hero-contact-panel" role="region" aria-label="QR-коды и ссылки для связи" initial={{ opacity: 0, height: reducedMotion ? 'auto' : 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: reducedMotion ? 'auto' : 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}><SocialBlock horizontal /></motion.div>}</AnimatePresence>
  </div>
}
