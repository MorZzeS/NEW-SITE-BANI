'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import styles from './ExitIntentOffer.module.css'

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
  description = 'Получи эксклюзивное предложение — скидку 25 000 ₽ на покупку бани BANGER.',
  label = 'Получить предложение',
  storageKey = DEFAULT_STORAGE_KEY,
  cooldownMs = DEFAULT_COOLDOWN,
}: ExitIntentOfferProps) {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const capability = window.matchMedia('(hover: hover) and (pointer: fine)')
    const isTouchDevice = () => navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700
    let eligible = capability.matches && !isTouchDevice()
    let moved = false

    const canShow = () => {
      if (!eligible || open) return false
      try {
        const lastShown = Number(window.localStorage.getItem(storageKey) ?? 0)
        return !lastShown || Date.now() - lastShown >= cooldownMs
      } catch {
        // A blocked storage context should not prevent the regular site flow.
        return true
      }
    }

    const onPointerMove = () => { moved = true }
    const onPointerLeave = (event: MouseEvent) => {
      if (isTouchDevice() || !moved || event.relatedTarget !== null || event.clientY > 8 || !canShow()) return
      try { window.localStorage.setItem(storageKey, String(Date.now())) } catch { /* ignore */ }
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
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return null

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) setOpen(false)
    }}>
      <section className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="exit-intent-title">
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
        <p className={styles.description}>{description}</p>
        <p className={styles.note}>Условия уточняются при обращении.</p>
        <button type="button" className={styles.action} onClick={() => {
          setOpen(false)
          if (onRequest) onRequest()
          else window.location.assign('/kontakty#zayavka')
        }}>
          {label}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
        </button>
      </section>
    </div>
  )
}
