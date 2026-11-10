'use client'
import { useId, useRef, useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { SocialBlock } from './SocialBlock'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export function HeroContactDisclosure() {
  const [open, setOpen] = useState(false)
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  return <div className="hero-contact-disclosure" onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); trigger.current?.focus() } }}>
    <button ref={trigger} type="button" className="hero-video-action w-full" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}><MessageCircle aria-hidden="true" size={18} />Мы на связи<ChevronDown aria-hidden="true" size={16} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} /></button>
    <AnimatePresence initial={false}>{open && <motion.div id={id} className="hero-contact-panel" role="region" aria-label="QR-коды и ссылки для связи" initial={{ opacity: 0, height: reducedMotion ? 'auto' : 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: reducedMotion ? 'auto' : 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}><SocialBlock horizontal /></motion.div>}</AnimatePresence>
  </div>
}
