'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, X } from 'lucide-react'
import styles from './ExitIntentOffer.module.css'
import { releasePolicy } from '@/lib/release-policy'
import { withBasePath } from '@/lib/site-path'

type ExitIntentOfferProps = {
  /** Called when the visitor chooses to continue to the contact flow. */
  onRequest?: () => void
  /** Owner-approved offer; this component never changes catalog prices. */
  title?: string
  description?: string
  label?: string
  storageKey?: string
  cooldownMs?: number
}

const DEFAULT_STORAGE_KEY = 'banger:exit-intent:last-shown'
const DEFAULT_COOLDOWN = 7 * 24 * 60 * 60 * 1000

/**
 * A quiet desktop-only exit-intent prompt. It listens only for a real pointer
 * leaving the top edge and never renders on touch/mobile devices.
 */
export function ExitIntentOffer({
  onRequest,
  title = 'Постой, не уходи!',
  description = 'Получите скидку 15 000 ₽ на покупку любой бани BANGER',
  label = 'Получить скидку 15 000 ₽',
  storageKey = DEFAULT_STORAGE_KEY,
  cooldownMs = DEFAULT_COOLDOWN,
}: ExitIntentOfferProps) {
  const [open, setOpen] = useState(false)
  const [rememberWeek, setRememberWeek] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const shownThisVisit = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const capability = window.matchMedia('(hover: hover) and (pointer: fine)')
    const isTouchDevice = () => navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700
    let eligible = capability.matches && !isTouchDevice()
    let moved = false

    const canShow = () => {
      if (!eligible || open || shownThisVisit.current || document.querySelector('[data-site-preferences-notice], dialog[open], [aria-modal="true"]')) return false
      try {
        const saved = window.localStorage.getItem(storageKey)
        if (saved === null) return true
        const lastShown = Number(saved)
        const elapsed = Date.now() - lastShown
        if (Number.isFinite(lastShown) && lastShown > 0 && elapsed >= 0 && elapsed < cooldownMs) return false
        window.localStorage.removeItem(storageKey)
        return true
      } catch {
        // A blocked storage context should not prevent the regular site flow.
        return true
      }
    }

    const onPointerMove = () => { moved = true }
    const onPointerLeave = (event: MouseEvent) => {
      if (isTouchDevice() || !moved || event.relatedTarget !== null || event.clientY > 8 || !canShow()) return
      shownThisVisit.current = true
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setOpen(true)
    }
    const onCapabilityChange = () => {
      eligible = capability.matches && !isTouchDevice()
      if (!eligible) setOpen(false)
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    capability.addEventListener('change', onCapabilityChange)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      capability.removeEventListener('change', onCapabilityChange)
    }
  }, [cooldownMs, open, storageKey])

  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus?.()
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return

      const dialog = closeButtonRef.current?.closest<HTMLElement>('[role="dialog"]')
      if (!dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled])',
      ))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) setOpen(false)
    }}>
      <section className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="exit-intent-title" aria-describedby="exit-intent-description exit-intent-note">
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.close}
          aria-label="Закрыть предложение"
          onClick={() => setOpen(false)}
        >
          <X aria-hidden="true" size={18} strokeWidth={1.7} />
        </button>
        <p className={styles.eyebrow}>Персональный расчёт</p>
        <h2 id="exit-intent-title">{title}</h2>
        <p id="exit-intent-description" className={styles.description}>{description}</p>
        <p id="exit-intent-note" className={styles.note}>Предложение действует на бани BANGER. Дома в акцию не входят.</p>
        <label className={styles.remember}>
          <input type="checkbox" checked={rememberWeek} onChange={(event) => {
            const checked = event.target.checked
            setRememberWeek(checked)
            try {
              if (checked) window.localStorage.setItem(storageKey, String(Date.now()))
              else window.localStorage.removeItem(storageKey)
            } catch { /* The in-memory once-per-visit guard still applies. */ }
          }} />
          <span>Не показывать неделю</span>
        </label>
        <button type="button" className={styles.action} onClick={() => {
          setOpen(false)
          if (onRequest) onRequest()
          else window.location.assign(withBasePath(releasePolicy.onlineLeads ? '/kontakty?source=exit-intent&from=' + encodeURIComponent(location.pathname) + '#zayavka' : '/kontakty'))
        }}>
          {label}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
        </button>
      </section>
    </div>, document.body
  )
}
