'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ANALYTICS_CONSENT_CHANNEL, ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_STORAGE_KEY, clearAnalyticsSessionRevocation, markAnalyticsRevokedInCurrentTab, readAnalyticsConsent, writeAnalyticsConsent } from '@/lib/analytics-consent'
import { releasePolicy } from '@/lib/release-policy'
import { getSitePreferences, setSitePreferences, PREFERENCES_EVENT, SITE_PREFERENCES_KEY, WEATHER_CITY_KEY } from '@/lib/site-preferences'
import styles from './CookieConsent.module.css'
import { OPEN_SITE_SETTINGS_EVENT } from './SiteSettingsButton'

/** Yandex Metrika and behavior replay are separate, optional choices. */
export default function CookieConsent() {
  const dialog = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [behaviorReplayEnabled, setBehaviorReplayEnabled] = useState(false)
  const [status, setStatus] = useState('')
  const [storageBlocked, setStorageBlocked] = useState(false)
  const analyticsAvailable = releasePolicy.analytics

  useEffect(() => {
    const sync = () => {
      const preference = getSitePreferences()
      const consent = readAnalyticsConsent()
      setAnalyticsEnabled(consent?.analytics === true)
      setBehaviorReplayEnabled(consent?.behaviorReplay === true)
      setBannerOpen(analyticsAvailable ? consent === null : preference === null)
    }
    sync()
    const storage = (event: StorageEvent) => {
      if (event.key === SITE_PREFERENCES_KEY || event.key === ANALYTICS_CONSENT_STORAGE_KEY || event.key === null) sync()
    }
    let consentChannel: BroadcastChannel | null = null
    const onConsentMessage = (event: MessageEvent<unknown>) => {
      if (!event.data || typeof event.data !== 'object') return
      const kind = (event.data as { kind?: unknown }).kind
      if (kind === 'revoked') {
        markAnalyticsRevokedInCurrentTab()
        sync()
      } else if (kind === 'changed') {
        clearAnalyticsSessionRevocation()
        sync()
      }
    }
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        consentChannel = new BroadcastChannel(ANALYTICS_CONSENT_CHANNEL)
        consentChannel.addEventListener('message', onConsentMessage)
      } catch { consentChannel = null }
    }
    window.addEventListener(PREFERENCES_EVENT, sync)
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync)
    window.addEventListener('storage', storage)
    window.addEventListener(OPEN_SITE_SETTINGS_EVENT, showSettings)
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, sync)
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync)
      window.removeEventListener('storage', storage)
      window.removeEventListener(OPEN_SITE_SETTINGS_EVENT, showSettings)
      consentChannel?.removeEventListener('message', onConsentMessage)
      consentChannel?.close()
    }
  }, [analyticsAvailable])

  function showSettings() {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const consent = readAnalyticsConsent()
    setAnalyticsEnabled(consent?.analytics === true)
    setBehaviorReplayEnabled(consent?.behaviorReplay === true)
    dialog.current?.showModal()
  }

  function dismissWithoutAnalytics() {
    if (analyticsAvailable && !writeAnalyticsConsent(false, false)) {
      setStorageBlocked(true)
      setStatus('Отказ не удалось сохранить надолго. Счётчик выключен в этой вкладке; перед перезагрузкой очистите данные сайта или сохранённое разрешение banger-consent-v3 в настройках браузера.')
      return
    }
    setSitePreferences(false)
    setAnalyticsEnabled(false)
    setBehaviorReplayEnabled(false)
    setStorageBlocked(false)
    setStatus('Аналитика отключена. Карту и отзывы Яндекса на странице «О компании» это решение не меняет.')
    setBannerOpen(false)
    dialog.current?.close()
  }

  function saveAnalyticsChoice(choice = analyticsEnabled, behaviorReplay = behaviorReplayEnabled) {
    if (!analyticsAvailable) {
      setSitePreferences(false)
      setBannerOpen(false)
      setStatus('Локальные настройки сохранены. Счётчик аналитики в этой версии не включён.')
      dialog.current?.close()
      return
    }
    if (!writeAnalyticsConsent(choice, behaviorReplay)) {
      setStorageBlocked(true)
      setStatus(choice
        ? 'Не удалось сохранить разрешение. Счётчик остаётся выключенным; проверьте хранилище браузера и повторите выбор.'
        : 'Отказ не удалось сохранить надолго. Счётчик остановлен в этой вкладке; перед перезагрузкой очистите данные сайта или сохранённое разрешение banger-consent-v3 в настройках браузера.')
      return
    }
    setSitePreferences(false)
    setStorageBlocked(false)
    setAnalyticsEnabled(choice)
    setBehaviorReplayEnabled(choice && behaviorReplay)
    setStatus(choice
      ? behaviorReplay
        ? 'Вы разрешили статистику Яндекс Метрики 111684946 и отдельно запись Вебвизора с картами кликов/ссылок. Выбор можно изменить в настройках сайта.'
        : 'Вы разрешили статистику через Яндекс Метрику 111684946. Вебвизор и карты кликов/ссылок не включены. Выбор можно изменить в настройках сайта.'
      : 'Аналитика отключена. Карту и отзывы Яндекса на странице «О компании» это решение не меняет.')
    setBannerOpen(false)
    dialog.current?.close()
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
    {bannerOpen && <section className={styles.notice} aria-label="Настройки cookie и статистики" data-site-preferences-notice>
      <p className={styles.noticeText}>
        {analyticsAvailable
          ? <>Разрешить cookie и статистику Яндекс Метрики. </>
          : <>Сайт использует cookie. </>}
        <Link href={analyticsAvailable ? '/privacy' : '/cookie'}>{analyticsAvailable ? 'Политика' : 'Подробнее'}</Link>
        {' · '}<button type="button" className={styles.settings} onClick={showSettings}>Настройки</button>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.acknowledge} onClick={() => analyticsAvailable ? saveAnalyticsChoice(true, false) : dismissWithoutAnalytics()} aria-label={analyticsAvailable ? 'Я согласен, разрешить статистику Яндекс Метрики' : 'Я согласен, закрыть уведомление'}>Я согласен, мне всё ясно</button>
      </div>
      {storageBlocked && <div className={styles.storageError}><p role="status">{status}</p></div>}
    </section>}
    <dialog ref={dialog} aria-labelledby="site-settings-title" onClose={() => { if (previousFocus.current?.isConnected) previousFocus.current.focus(); else document.querySelector<HTMLButtonElement>('[data-site-settings-trigger]')?.focus() }} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'))
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }} className={styles.dialog}>
      <h2 id="site-settings-title">Настройки сайта</h2>
      <p>Тема, избранное, выбор модели и дополнений, район доставки и отметка о скрытии предложения хранятся в браузере для работы выбранных функций. Адрес, имя, телефон и комментарий в сохранённые комплектации не записываются.</p>
      {analyticsAvailable ? <>
        <label className={styles.preference}>
          <input type="checkbox" checked={analyticsEnabled} onChange={event => { const checked = event.target.checked; setAnalyticsEnabled(checked); if (!checked) setBehaviorReplayEnabled(false) }} />
          <span><strong>Разрешить статистику посещений</strong><small>При включении сайт загрузит счётчик 111684946; Яндекс получает технические сведения о посещении, включая IP-адрес и сведения о браузере/устройстве. Передаются только события, перечисленные в политике. Нажатие кнопки отправки не считается успешной заявкой: цель отправляется после подтверждения сервера. Автоматические цели не создаются по другим ссылкам; карты кликов/ссылок доступны только при отдельном согласии на запись поведения. Поля заявки, адрес, комментарий, номер и сумма не передаются в цели. Настройка не влияет на работу сайта и формы.</small></span>
        </label>
        <label className={styles.preference}>
          <input type="checkbox" checked={behaviorReplayEnabled} disabled={!analyticsEnabled} onChange={event => setBehaviorReplayEnabled(event.target.checked)} />
          <span><strong>Разрешить Вебвизор и карты кликов/ссылок</strong><small>Отдельная настройка включает запись сессий Вебвизора и карты кликов/ссылок: видимых действий, перемещения курсора, прокрутки, нажатий и переходов по ссылкам. Карта скроллинга и отчёты аналитики форм на используемой SPA-версии сайта не поддерживаются и не используются. Значения полей с именем, телефоном, адресом, моделью и комментарием, сводка комплектации, номер заявки и динамические сообщения закрываются средствами Яндекс Метрики. В кабинете Метрики выключена запись нажатий клавиш во всех полях. Введённые значения не передаются.</small></span>
        </label>
      </> : <p>Счётчик аналитики в этой версии выключен.</p>}
      <p>Карта и отзывы Яндекса на странице «О компании» загружаются автоматически независимо от выбора аналитики. При этом браузер обращается к Яндексу; внешняя карта может получать IP-адрес и технические заголовки по правилам Яндекса.</p>
      <div className={styles.clearActions}>
        <button type="button" onClick={clearConfigurations}>Удалить сохранённые комплектации</button>
        <button type="button" onClick={() => clearSetting(WEATHER_CITY_KEY, 'Город погоды')}>Удалить сохранённый город</button>
        <button type="button" onClick={() => clearSetting('banger:exit-intent:last-shown', 'Ограничение показа предложения')}>Удалить отметку «Не показывать неделю»</button>
        <button type="button" onClick={() => clearSetting('banger-theme', 'Тема оформления')}>Удалить сохранённую тему</button>
        <button type="button" onClick={() => clearSetting('banger-favorites', 'Избранное')}>Удалить сохранённое избранное</button>
      </div>
      {status && <p role="status" className={styles.status}>{status}</p>}
      <Link href="/cookie" onClick={() => dialog.current?.close()} className={styles.more}>Подробнее о хранении настроек</Link>
      <div className={styles.dialogActions}>
        <button type="button" className="btn-primary" onClick={() => saveAnalyticsChoice()}>{analyticsAvailable ? 'Сохранить выбор' : 'Сохранить настройки'}</button>
        {analyticsAvailable && <button type="button" className="btn-secondary" onClick={dismissWithoutAnalytics}>Отклонить аналитику</button>}
        <button type="button" className="btn-secondary" onClick={() => dialog.current?.close()}>Закрыть</button>
      </div>
    </dialog>
  </>
}
