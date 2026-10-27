'use client'

import { ChevronDown, LocateFixed, RefreshCw, Wind } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { defaultWeatherCity, nearestSupportedCity, readWeatherSnapshot, weatherCities, weatherLabel, weatherRecommendation, weatherSource, type WeatherCity, type WeatherSnapshot } from '@/lib/weather'
import { getSitePreferences, setSitePreferences, PREFERENCES_EVENT, SITE_PREFERENCES_KEY, WEATHER_CITY_KEY } from '@/lib/site-preferences'
import { WeatherVisual } from './WeatherVisual'

type Status = 'idle' | 'loading' | 'ready' | 'error'
const normalize = (value: string) => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim()

export function WeatherWide() {
  const [cityId, setCityId] = useState(defaultWeatherCity.id)
  const [hydrated, setHydrated] = useState(false)
  const [remember, setRemember] = useState(false)
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [requestError, setRequestError] = useState('')
  const [locationMessage, setLocationMessage] = useState('')
  const [locating, setLocating] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const reducedMotion = useReducedMotion()
  const requestVersion = useRef(0)
  const geoVersion = useRef(0)
  const activeRequest = useRef<AbortController | null>(null)
  const city = useMemo(() => weatherCities.find(item => item.id === cityId) ?? defaultWeatherCity, [cityId])
  const matches = useMemo(() => weatherCities.filter(item => normalize(item.name).startsWith(normalize(query))), [query])

  useEffect(() => {
    const allowed = getSitePreferences()?.rememberWeatherCity === true
    setRemember(allowed)
    if (allowed) {
      try {
        const stored = localStorage.getItem(WEATHER_CITY_KEY)
        if (weatherCities.some(item => item.id === stored)) setCityId(stored!)
      } catch { /* Storage may be disabled; weather still works. */ }
    }
    setHydrated(true)
    const sync = () => setRemember(getSitePreferences()?.rememberWeatherCity === true)
    const onStorage = (event: StorageEvent) => { if (event.key === SITE_PREFERENCES_KEY || event.key === null) sync() }
    window.addEventListener(PREFERENCES_EVENT, sync)
    window.addEventListener('storage', onStorage)
    return () => { window.removeEventListener(PREFERENCES_EVENT, sync); window.removeEventListener('storage', onStorage) }
  }, [])

  useEffect(() => {
    if (!hydrated || !remember) return
    try { localStorage.setItem(WEATHER_CITY_KEY, city.id) } catch { /* Optional preference cannot block forecast. */ }
  }, [hydrated, remember, city.id])

  const load = useCallback(async () => {
    const version = ++requestVersion.current
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    let timedOut = false
    const timer = window.setTimeout(() => { timedOut = true; controller.abort() }, 10_000)
    setSnapshot(null); setStatus('loading'); setRequestError('')
    try {
      const response = await fetch(`/weather/${city.id}.json`, { signal: controller.signal, headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', mode: 'same-origin', redirect: 'error' })
      if (!response.ok) throw new Error('Snapshot unavailable')
      const data = readWeatherSnapshot(await response.json(), city)
      if (version !== requestVersion.current) return
      setSnapshot(data); setStatus('ready')
    } catch (error) {
      if ((error as Error).name === 'AbortError' && !timedOut || version !== requestVersion.current) return
      setSnapshot(null); setStatus('error')
      setRequestError('Свежий прогноз пока недоступен. Попробуйте обновить его чуть позже.')
    } finally {
      window.clearTimeout(timer)
      if (activeRequest.current === controller) activeRequest.current = null
    }
  }, [city])

  useEffect(() => {
    if (hydrated) void load()
    return () => { requestVersion.current++; activeRequest.current?.abort() }
  }, [hydrated, load])
  useEffect(() => () => { geoVersion.current++ }, [])

  const changeCity = (id: string) => {
    geoVersion.current++; setLocating(false)
    if (id !== cityId) {
      requestVersion.current++; activeRequest.current?.abort()
      setSnapshot(null); setStatus('loading'); setCityId(id)
    }
    setListOpen(false); setQuery(''); setLocationMessage('')
  }

  const locate = () => {
    const version = ++geoVersion.current
    setLocationMessage(''); setLocating(true)
    const fallback = (message: string) => {
      if (version !== geoVersion.current) return
      changeCity(defaultWeatherCity.id)
      setLocationMessage(message)
    }
    if (!navigator.geolocation) { fallback('Браузер не поддерживает определение местоположения. Показываем Москву; выберите город вручную.'); return }
    navigator.geolocation.getCurrentPosition(position => {
      if (version !== geoVersion.current) return
      const nearest = nearestSupportedCity(position.coords.latitude, position.coords.longitude, position.coords.accuracy)
      if (!nearest) { fallback('Поблизости нет поддерживаемого города или точности недостаточно. Показываем Москву; выберите город вручную.'); return }
      changeCity(nearest.id)
      setLocationMessage(`Ближайший город: ${nearest.name}. Прогноз для города, а не точного адреса.`)
    }, error => {
      fallback(error.code === 1 ? 'Доступ к местоположению не разрешён. Показываем Москву; можно выбрать другой город.' : 'Не удалось определить местоположение. Показываем Москву; выберите город вручную.')
    }, { enableHighAccuracy: false, timeout: 10_000, maximumAge: 0 })
  }

  useEffect(() => {
    const update = () => setNow(new Date())
    update(); const timer = window.setInterval(update, 30_000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const header = document.querySelector('header.site-header')
    if (!header) return
    const update = () => sectionRef.current?.style.setProperty('--weather-header-height', `${header.getBoundingClientRect().height}px`)
    update(); const observer = new ResizeObserver(update); observer.observe(header)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!snapshot || status !== 'ready') return
    const remaining = Math.max(0, Math.min(Date.parse(snapshot.forecastTime) + 90 * 60_000, Date.parse(snapshot.sourceCheckedAt!) + 2 * 60 * 60_000, Date.parse(snapshot.updatedAt) + 12 * 60 * 60_000) - Date.now())
    const timer = window.setTimeout(() => { setSnapshot(null); setStatus('error'); setRequestError('Прогноз устарел. Обновите данные, чтобы увидеть свежую погоду.') }, remaining)
    return () => window.clearTimeout(timer)
  }, [snapshot, status])
  useEffect(() => {
    if (listOpen) document.getElementById(`weather-city-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, listOpen])

  const dateFormat = new Intl.DateTimeFormat('ru-RU', { timeZone: city.timezone, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const clock = now ? new Intl.DateTimeFormat('ru-RU', { timeZone: city.timezone, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(now) : ''
  const hour = now ? Number(new Intl.DateTimeFormat('en-GB', { timeZone: city.timezone, hour: '2-digit', hourCycle: 'h23' }).format(now)) : 12
  const symbol = snapshot?.symbol ?? ''

  return <section ref={sectionRef} className="weather-wide-section weather-strip-section" aria-label="Погода для загородного отдыха" onKeyDown={event => {
    if (event.key === 'Escape' && !listOpen && open) { setOpen(false); toggleRef.current?.focus() }
  }}>
    <div className="site-container"><div className="weather-wide weather-strip glass" data-open={open}>
      <button ref={toggleRef} type="button" className="weather-strip-toggle" aria-expanded={open} aria-controls="weather-details" onClick={() => setOpen(value => !value)}>
        {snapshot && <WeatherVisual symbol={symbol} compact />}
        <span className="weather-strip-city">{city.name}</span>
        <span className="weather-strip-temperature">{status === 'ready' && snapshot ? `${snapshot.temperature > 0 ? '+' : ''}${Math.round(snapshot.temperature)}°` : status === 'loading' ? 'Загрузка…' : 'Нет данных'}</span>
        <span className="weather-strip-message">{snapshot ? weatherLabel(symbol) + ' · ' + weatherRecommendation(snapshot, hour) : 'Погода для вашего банного дня'}</span>
        <span className="weather-strip-more">{open ? 'Свернуть' : 'Подробнее'}</span><ChevronDown className="weather-strip-chevron" size={16} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>{open && <motion.div key="weather-details" id="weather-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }} className="weather-details-shell"><div className="weather-details-inner">
        <div className="weather-wide-topline"><div><p className="section-tag">За городом — в любую погоду</p><h2>Выберите день для отдыха</h2></div>
          <div className="weather-city-control" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setListOpen(false) }}>
            <label className="weather-city-label" htmlFor="weather-city-search">Город</label>
            <div className="weather-city-search-wrap"><input id="weather-city-search" ref={searchRef} role="combobox" autoComplete="off" aria-autocomplete="list" aria-expanded={listOpen} aria-controls="weather-city-list" aria-activedescendant={listOpen && matches[activeIndex] ? `weather-city-${activeIndex}` : undefined} value={listOpen ? query : city.name} placeholder={city.name} onClick={() => { if (!listOpen) { setQuery(''); setActiveIndex(0); setListOpen(true) } }} onFocus={() => { setQuery(''); setActiveIndex(0); setListOpen(true) }} onChange={event => { setQuery(event.target.value); setActiveIndex(0); setListOpen(true) }} onKeyDown={event => {
              if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setListOpen(false); return }
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setListOpen(true); setActiveIndex(current => matches.length ? (current + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length : 0) }
              if (event.key === 'Enter' && listOpen) { event.preventDefault(); if (matches[activeIndex]) changeCity(matches[activeIndex].id) }
            }} /><ChevronDown aria-hidden="true" size={16} /></div>
            {listOpen && <ul role="listbox" id="weather-city-list" aria-label="Города по алфавиту" className="weather-city-list">{matches.map((item, index) => <li id={`weather-city-${index}`} key={item.id} role="option" aria-selected={item.id === city.id} data-active={index === activeIndex} onMouseDown={event => event.preventDefault()} onClick={() => changeCity(item.id)}>{item.name}{item.id === city.id && <span aria-hidden="true"> ✓</span>}</li>)}{!matches.length && <li role="presentation" className="weather-city-empty">Город не найден. Попробуйте первые буквы другого названия.</li>}</ul>}
            <label className="weather-remember"><input type="checkbox" checked={remember} onChange={event => {
              if (!setSitePreferences(event.target.checked)) setLocationMessage('Браузер не разрешает сохранить настройку. Город доступен в этом посещении.')
            }} />Запомнить город</label>
          </div>
        </div>
        <div className="weather-actions"><button type="button" className="weather-retry" disabled={locating} onClick={locate}><LocateFixed size={16} aria-hidden="true" />{locating ? 'Определяем местоположение…' : 'Определить моё местоположение'}</button><button type="button" className="weather-retry" disabled={status === 'loading'} onClick={() => void load()}><RefreshCw aria-hidden="true" size={15} />{status === 'loading' ? 'Загрузка прогноза…' : status === 'error' ? 'Повторить запрос' : 'Обновить прогноз'}</button></div>
        <p className="weather-location-note">По местоположению выберем ближайший город из списка. Код сайта использует координаты только на устройстве и не отправляет их на свой сервер или поставщику погоды. Работа служб геолокации зависит от настроек браузера и устройства.</p>
        {locationMessage && <p className="weather-location-message" role="status">{locationMessage}</p>}
        <div className="weather-wide-body" aria-live="polite" aria-busy={status === 'loading'}><div className="weather-time">{clock}</div>
          {status === 'loading' && <div className="weather-state"><span className="weather-loader" aria-hidden="true" />Загружаем погоду: {city.name}…</div>}
          {status === 'error' && <div className="weather-state"><p>{requestError}</p></div>}
          {snapshot && status === 'ready' && <div className="weather-result"><div className="weather-primary"><WeatherVisual symbol={symbol} /><div className="weather-temp">{snapshot.temperature > 0 ? '+' : ''}{Math.round(snapshot.temperature)}°</div><div><p className="weather-condition">{weatherLabel(symbol)}</p><p className="weather-meta"><Wind aria-hidden="true" size={15} />{snapshot.wind.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} м/с</p></div></div><div><p className="weather-forecast">Ближайшие {snapshot.forecastHours ?? 1} ч: {weatherLabel(symbol).toLocaleLowerCase('ru')}{snapshot.precipitation !== undefined ? `, осадки ${snapshot.precipitation.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} мм` : ''}.</p><p className="weather-recommendation">{weatherRecommendation(snapshot, hour)}</p></div></div>}
        </div>
        <div className="weather-wide-footer"><span>{snapshot ? `Прогноз на ${dateFormat.format(new Date(snapshot.forecastTime))} · обновлён ${dateFormat.format(new Date(snapshot.updatedAt))}` : 'Показываем только свежий прогноз.'}</span><span><a href={weatherSource.url} target="_blank" rel="noreferrer">MET Norway</a> · <a href={weatherSource.license} target="_blank" rel="noreferrer">CC BY 4.0</a> · представление BANGER · города: <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a></span></div>
      </div></motion.div>}</AnimatePresence>
    </div></div>
  </section>
}
