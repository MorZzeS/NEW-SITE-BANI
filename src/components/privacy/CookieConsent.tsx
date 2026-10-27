'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getSitePreferences, setSitePreferences, PREFERENCES_EVENT, SITE_PREFERENCES_KEY, WEATHER_CITY_KEY } from '@/lib/site-preferences'
import styles from './CookieConsent.module.css'

/** Preference controls only: this release never starts tracking or online leads. */
export default function CookieConsent() {
  const dialog = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [rememberCity, setRememberCity] = useState(false)
  const [status, setStatus] = useState('')
  const [storageBlocked, setStorageBlocked] = useState(false)

  useEffect(() => {
    const sync = () => {
      const preference = getSitePreferences()
      setRememberCity(preference?.rememberWeatherCity === true)
      setBannerOpen(preference === null)
    }
    sync()
    const storage = (event: StorageEvent) => { if (event.key === SITE_PREFERENCES_KEY || event.key === null) sync() }
    window.addEventListener(PREFERENCES_EVENT, sync)
    window.addEventListener('storage', storage)
    return () => { window.removeEventListener(PREFERENCES_EVENT, sync); window.removeEventListener('storage', storage) }
  }, [])

  function choose(remember: boolean) {
    if (!setSitePreferences(remember)) {
      setStorageBlocked(true)
      setStatus('Браузер не разрешил сохранить выбор. Необязательные настройки сохраняться не будут.')
      return
    }
    setStatus(remember ? 'Разрешено запоминать выбранный город. Аналитика остаётся выключенной.' : 'Необязательное сохранение города отключено.')
    setStorageBlocked(false)
    setBannerOpen(false)
    dialog.current?.close()
  }
  function showSettings() {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setRememberCity(getSitePreferences()?.rememberWeatherCity === true)
    dialog.current?.showModal()
  }
  function clearSetting(key: string, label: string) {
    try { localStorage.removeItem(key); setStatus(`${label}: сохранённая запись удалена. Изменения учитываются при следующем открытии страницы.`) }
    catch { setStatus('Браузер не разрешил изменение хранилища. Очистите данные сайта через его настройки.') }
  }
  return <>
    {bannerOpen && <section className={styles.notice} aria-labelledby="site-preferences-notice-title" data-site-preferences-notice>
      <div><p className={styles.eyebrow}>Ваши настройки</p><h2 id="site-preferences-notice-title">Удобство без лишних cookie</h2><p>Аналитика и рекламные cookie отключены. С вашего разрешения запомним выбранный город для погоды. <Link href="/cookie">Подробнее</Link></p></div>
      <div className={styles.actions}><button type="button" className="btn-primary" onClick={() => choose(true)}>Разрешить сохранение города</button><button type="button" className="btn-secondary" onClick={() => choose(false)}>Только необходимые</button><button type="button" className={styles.settings} onClick={showSettings}>Настроить параметры</button></div>
      {storageBlocked && <div className={styles.storageError}><p role="status">{status}</p><button type="button" onClick={() => setBannerOpen(false)}>Продолжить без сохранения</button></div>}
    </section>}
    {!bannerOpen && <div className={styles.trigger}><button type="button" className="btn-secondary px-3 py-2 text-xs" data-site-settings-trigger aria-haspopup="dialog" onClick={showSettings}>Настройки сайта</button></div>}
    <dialog ref={dialog} aria-labelledby="site-settings-title" onClose={() => { if (previousFocus.current?.isConnected) previousFocus.current.focus(); else document.querySelector<HTMLButtonElement>('[data-site-settings-trigger]')?.focus() }} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'))
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }} className={styles.dialog}>
      <h2 id="site-settings-title">Локальные настройки</h2>
      <p>Необходимые настройки помогают сайту работать. Тема сохраняется при её переключении; отметка «Не показывать неделю» — только по отдельному выбору в предложении.</p>
      <p>Аналитика, Webvisor и рекламные cookie отключены. Разрешение ниже не включает их и не запускает прогноз.</p>
      <label className={styles.preference}><input type="checkbox" checked={rememberCity} onChange={event => setRememberCity(event.target.checked)} /><span><strong>Запоминать выбранный город</strong><small>Только название города из списка. Точные координаты не сохраняются.</small></span></label>
      <div className={styles.clearActions}>
        <button type="button" onClick={() => clearSetting(WEATHER_CITY_KEY, 'Город погоды')}>Удалить сохранённый город</button>
        <button type="button" onClick={() => clearSetting('banger:exit-intent:last-shown', 'Ограничение показа предложения')}>Удалить отметку «Не показывать неделю»</button>
        <button type="button" onClick={() => clearSetting('banger-theme', 'Тема оформления')}>Удалить сохранённую тему</button>
        <button type="button" onClick={() => clearSetting('banger-favorites', 'Избранное')}>Удалить сохранённое избранное</button>
      </div>
      {status && <p role="status" className={styles.status}>{status}</p>}
      <Link href="/cookie" onClick={() => dialog.current?.close()} className={styles.more}>Подробнее о хранении настроек</Link>
      <div className={styles.dialogActions}><button type="button" className="btn-primary" onClick={() => choose(rememberCity)}>Сохранить настройки</button><button type="button" className="btn-secondary" onClick={() => dialog.current?.close()}>Закрыть</button></div>
    </dialog>
  </>
}
