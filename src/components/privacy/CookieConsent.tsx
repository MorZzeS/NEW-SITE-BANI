'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getSitePreferences, setSitePreferences, PREFERENCES_EVENT, SITE_PREFERENCES_KEY, WEATHER_CITY_KEY } from '@/lib/site-preferences'
import styles from './CookieConsent.module.css'
import { OPEN_SITE_SETTINGS_EVENT } from './SiteSettingsButton'

/** Local preference controls are separate from the automatically loaded Yandex map and reviews. */
export default function CookieConsent() {
  const dialog = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [storageBlocked, setStorageBlocked] = useState(false)

  useEffect(() => {
    const sync = () => {
      const preference = getSitePreferences()
      setBannerOpen(preference === null)
    }
    sync()
    const storage = (event: StorageEvent) => { if (event.key === SITE_PREFERENCES_KEY || event.key === null) sync() }
    window.addEventListener(PREFERENCES_EVENT, sync)
    window.addEventListener('storage', storage)
    window.addEventListener(OPEN_SITE_SETTINGS_EVENT, showSettings)
    return () => { window.removeEventListener(PREFERENCES_EVENT, sync); window.removeEventListener('storage', storage); window.removeEventListener(OPEN_SITE_SETTINGS_EVENT, showSettings) }
  }, [])

  function choose() {
    if (!setSitePreferences(false)) {
      setStorageBlocked(true)
      setStatus('Браузер не разрешил сохранить локальные настройки. Погодный виджет, Метрика и Webvisor остаются выключенными; карта и отзывы Яндекса на странице «О компании» загружаются независимо от этого выбора.')
      return
    }
    setStatus('Локальные настройки сохранены. Погодный виджет, Метрика и Webvisor выключены; карта и отзывы Яндекса на странице «О компании» загружаются автоматически.')
    setStorageBlocked(false)
    setBannerOpen(false)
    dialog.current?.close()
  }
  function showSettings() {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.current?.showModal()
  }
  function clearSetting(key: string, label: string) {
    try { localStorage.removeItem(key); setStatus(`${label}: сохранённая запись удалена. Изменения учитываются при следующем открытии страницы.`) }
    catch { setStatus('Браузер не разрешил изменение хранилища. Очистите данные сайта через его настройки.') }
  }
  function clearConfigurations() {
    try {
      Object.keys(localStorage).filter(key => key.startsWith('banger:model-configuration:v1:')).forEach(key => localStorage.removeItem(key))
      setStatus('Сохранённые комплектации удалены. Открытый расчёт остаётся на странице до сброса или перезагрузки.')
    } catch { setStatus('Браузер не разрешил изменение хранилища. Очистите данные сайта через его настройки.') }
  }
  return <>
    {bannerOpen && <section className={styles.notice} aria-labelledby="site-preferences-notice-title" data-site-preferences-notice>
      <div><p className={styles.eyebrow}>Ваши настройки</p><h2 id="site-preferences-notice-title">Настройки сайта</h2><p>Погодный виджет, Яндекс Метрика, Webvisor и собственные рекламные cookie BANGER.SU отключены. На странице «О компании» карта и отзывы Яндекса загружаются автоматически; Яндекс может получить IP-адрес, технические заголовки и использовать свои cookie. <Link href="/cookie">Подробнее</Link></p></div>
      <div className={styles.actions}><button type="button" className="btn-primary" onClick={choose}>Продолжить без дополнительных настроек</button><button type="button" className={styles.settings} onClick={showSettings}>Настройки сайта</button></div>
      {storageBlocked && <div className={styles.storageError}><p role="status">{status}</p><button type="button" onClick={() => setBannerOpen(false)}>Продолжить без сохранения</button></div>}
    </section>}
    <dialog ref={dialog} aria-labelledby="site-settings-title" onClose={() => { if (previousFocus.current?.isConnected) previousFocus.current.focus(); else document.querySelector<HTMLButtonElement>('[data-site-settings-trigger]')?.focus() }} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'))
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }} className={styles.dialog}>
      <h2 id="site-settings-title">Локальные настройки</h2>
      <p>Тема, избранное, выбор модели и дополнений, район доставки и отметка о скрытии предложения хранятся только в браузере для работы выбранных функций. Адрес, имя, телефон и комментарий в сохранённые комплектации не записываются.</p>
      <p>Погодный виджет, Яндекс Метрика, Webvisor и собственные рекламные cookie BANGER.SU отключены. На странице «О компании» карта и отзывы Яндекса загружаются автоматически; внешний сервис может получить IP-адрес, технические заголовки и использовать свои cookie. Сайт не запрашивает геолокацию и не загружает прогноз.</p>
      <div className={styles.clearActions}>
        <button type="button" onClick={clearConfigurations}>Удалить сохранённые комплектации</button>
        <button type="button" onClick={() => clearSetting(WEATHER_CITY_KEY, 'Город погоды')}>Удалить сохранённый город</button>
        <button type="button" onClick={() => clearSetting('banger:exit-intent:last-shown', 'Ограничение показа предложения')}>Удалить отметку «Не показывать неделю»</button>
        <button type="button" onClick={() => clearSetting('banger-theme', 'Тема оформления')}>Удалить сохранённую тему</button>
        <button type="button" onClick={() => clearSetting('banger-favorites', 'Избранное')}>Удалить сохранённое избранное</button>
      </div>
      {status && <p role="status" className={styles.status}>{status}</p>}
      <Link href="/cookie" onClick={() => dialog.current?.close()} className={styles.more}>Подробнее о хранении настроек</Link>
      <div className={styles.dialogActions}><button type="button" className="btn-primary" onClick={choose}>Сохранить необходимые настройки</button><button type="button" className="btn-secondary" onClick={() => dialog.current?.close()}>Закрыть</button></div>
    </dialog>
  </>
}
