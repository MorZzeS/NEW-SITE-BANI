'use client'

import Link from 'next/link'
import { useRef } from 'react'

/** Local settings information; no analytics choice exists in this release. */
export default function CookieConsent() {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  return <>
    <div className="fixed bottom-4 left-4 z-[90]">
      <button ref={trigger} type="button" className="btn-secondary px-3 py-2 text-xs" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>Настройки сайта</button>
    </div>
    <dialog ref={dialog} aria-labelledby="site-settings-title" onClose={() => trigger.current?.focus()} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }} className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-[var(--glass-border)] p-5 text-[var(--color-text)] backdrop:bg-black/60" style={{ background: 'var(--color-surface)' }}>
      <h2 id="site-settings-title" className="text-xl font-semibold">Локальные настройки</h2>
      <p className="mt-3 text-sm">Сайт сохраняет тему оформления на вашем устройстве. Настройки можно удалить через настройки браузера.</p>
      <p className="mt-3 text-sm">Аналитика и автоматическая загрузка внешних виджетов в этой версии отключены.</p>
      <Link href="/cookie" onClick={() => dialog.current?.close()} className="mt-4 inline-block underline">Подробнее о хранении настроек</Link>
      <div className="mt-5"><button type="button" autoFocus className="btn-primary" onClick={() => dialog.current?.close()}>Закрыть</button></div>
    </dialog>
  </>
}
