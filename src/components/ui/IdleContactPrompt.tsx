'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Instagram, MessageCircle, Send, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { siteSettings } from '@/data'
import { socialLinks } from '@/data/social'
import { markEngagementPromptShown, wasEngagementPromptShown } from '@/lib/engagement-prompt'
import { withBasePath } from '@/lib/site-path'
import styles from './IdleContactPrompt.module.css'

const IDLE_DELAY_MS = 60_000
const socialIcons: Record<(typeof socialLinks)[number]['id'], LucideIcon> = {
  max: MessageCircle,
  vk: Users,
  telegram: Send,
  instagram: Instagram,
}

/** A once-per-tab contact shortcut that appears only after a quiet minute. */
export function IdleContactPrompt() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const max = socialLinks.find(item => item.id === 'max')

  useEffect(() => {
    let timer = 0
    let shown = wasEngagementPromptShown()

    const hasBlockingUi = () => Boolean(document.querySelector(
      '[data-site-preferences-notice], dialog[open], [aria-modal="true"]',
    ))
    const isInForm = () => document.activeElement instanceof HTMLElement && Boolean(document.activeElement.closest('form'))

    const showWhenReady = () => {
      if (shown || wasEngagementPromptShown()) return
      if (hasBlockingUi() || isInForm()) {
        timer = window.setTimeout(showWhenReady, 10_000)
        return
      }
      shown = true
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      markEngagementPromptShown()
      setOpen(true)
    }

    const schedule = () => {
      window.clearTimeout(timer)
      if (!shown && !wasEngagementPromptShown()) timer = window.setTimeout(showWhenReady, IDLE_DELAY_MS)
    }

    const activityEvents: Array<keyof WindowEventMap> = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'click']
    activityEvents.forEach(type => window.addEventListener(type, schedule, { passive: true }))
    schedule()
    return () => {
      window.clearTimeout(timer)
      activityEvents.forEach(type => window.removeEventListener(type, schedule))
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      closeRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function restoreFocus() {
    if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus({ preventScroll: true })
    previousFocusRef.current = null
  }

  function close() {
    setOpen(false)
  }

  if (!max) return null

  return <dialog
    ref={dialogRef}
    className={styles.dialog}
    aria-labelledby="idle-contact-title"
    aria-describedby="idle-contact-subtitle"
    onClose={() => { setOpen(false); restoreFocus() }}
    onCancel={event => { event.preventDefault(); close() }}
    onClick={event => { if (event.target === event.currentTarget) close() }}
  >
    <section className={styles.panel}>
      <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Закрыть окно связи">
        <X aria-hidden="true" size={19} />
      </button>
      <header className={styles.heading}>
        <span className={styles.eyebrow}>BANGER.SU · НА СВЯЗИ</span>
        <h2 id="idle-contact-title">Хотите задать вопрос?</h2>
        <p id="idle-contact-subtitle">Пн–Вс, 9:00–19:00 · Напишите нам</p>
      </header>

      <div className={styles.contactGrid}>
        <a href={max.url} target="_blank" rel="noopener noreferrer" className={styles.qrCard} aria-label="Открыть MAX">
          <span className={styles.qrFrame}>
            <Image src={withBasePath(max.qr)} alt="QR-код MAX" width={156} height={156} unoptimized />
          </span>
          <span className={styles.qrCaption}>Наведите камеру и напишите нам в MAX</span>
        </a>

        <nav className={styles.socials} aria-label="Написать в социальные сети">
          {socialLinks.map(item => {
            const Icon = socialIcons[item.id]
            return <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Icon aria-hidden="true" size={18} />
              <span>{item.name}</span>
              <span className={styles.socialAction}>Написать</span>
            </a>
          })}
        </nav>
      </div>

      <div className={styles.phones}>
        <span className={styles.phoneHint}>Предпочитаете позвонить?</span>
        <a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a>
        <a href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a>
      </div>
    </section>
  </dialog>
}
