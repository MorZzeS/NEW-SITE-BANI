'use client'

import { ChevronDown, Cloud, CloudRain, CloudSnow, CloudLightning, Sun, RefreshCw, Wind } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { readWeatherSnapshot, weatherCities, weatherLabel, weatherRecommendation, weatherSource, type WeatherCity, type WeatherSnapshot } from '@/lib/weather'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export function WeatherWide() {
  const [cityId, setCityId] = useState<WeatherCity['id']>('ramenskoe')
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [requestError, setRequestError] = useState('')
  const [now, setNow] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const requestVersion = useRef(0)
  const activeRequest = useRef<AbortController | null>(null)
  const city = useMemo(() => weatherCities.find((item) => item.id === cityId) ?? weatherCities[0], [cityId])

  const load = useCallback(async () => {
    const version = ++requestVersion.current
    activeRequest.current?.abort()
    const timeout = new AbortController()
    activeRequest.current = timeout
    let timedOut = false
    const timer = window.setTimeout(() => { timedOut = true; timeout.abort() }, 10_000)
    setSnapshot(null)
    setStatus('loading')
    setRequestError('')
    try {
      const response = await fetch(`/weather/${city.id}.json`, { signal: timeout.signal, headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', mode: 'same-origin', redirect: 'error' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = readWeatherSnapshot(await response.json(), city)
      if (version !== requestVersion.current) return
      setSnapshot(data)
      setStatus('ready')
    } catch (error) {
      if ((error as Error).name === 'AbortError' && !timedOut) return
      if (version !== requestVersion.current) return
      setSnapshot(null)
      setRequestError('Погодный сервис временно недоступен. Попробуйте обновить данные.')
      setStatus('error')
    } finally {
      window.clearTimeout(timer)
      if (activeRequest.current === timeout) activeRequest.current = null
    }
  }, [city])

  useEffect(() => () => {
    requestVersion.current++
    activeRequest.current?.abort()
  }, [])

  const changeCity = (id: WeatherCity['id']) => {
    requestVersion.current++
    activeRequest.current?.abort()
    activeRequest.current = null
    setCityId(id)
    setSnapshot(null)
    setRequestError('')
    setStatus('idle')
  }

  useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const timer = window.setInterval(update, 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const header = document.querySelector('header.site-header')
    if (!header) return
    const observer = new ResizeObserver(() => sectionRef.current?.style.setProperty('--weather-header-height', `${header.getBoundingClientRect().height}px`))
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!snapshot || status !== 'ready') return
    const remaining = Math.max(0, Math.min(Date.parse(snapshot.forecastTime) + 90 * 60_000, Date.parse(snapshot.sourceCheckedAt!) + 2 * 60 * 60_000, Date.parse(snapshot.updatedAt) + 12 * 60 * 60_000) - Date.now())
    const timer = window.setTimeout(() => { setSnapshot(null); setStatus('error'); setRequestError('Прогноз устарел. Запросите свежие данные.') }, remaining)
    return () => window.clearTimeout(timer)
  }, [snapshot, status])

  const clock = now ? new Intl.DateTimeFormat('ru-RU', { timeZone: city.timezone, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(now) : 'Местное время уточняется…'
  const hour = now ? Number(new Intl.DateTimeFormat('en-GB', { timeZone: city.timezone, hour: '2-digit', hourCycle: 'h23' }).format(now)) : 12
  const forecastTime = snapshot ? new Intl.DateTimeFormat('ru-RU', { timeZone: city.timezone, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(snapshot.forecastTime)) : ''

  const symbol = snapshot?.symbol ?? ''
  const Icon = symbol.includes('thunder') ? CloudLightning : symbol.includes('snow') || symbol.includes('sleet') ? CloudSnow : symbol.includes('rain') ? CloudRain : symbol.includes('clearsky') || symbol.includes('fair') ? Sun : Cloud
  const recommendation = snapshot ? weatherRecommendation(snapshot, hour) : ''

  return <section ref={sectionRef} className="weather-wide-section weather-strip-section" aria-label="Погода для загородного отдыха" onKeyDown={(event) => { if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus() } }}>
    <div className="site-container">
      <div className="weather-wide weather-strip glass" data-open={open}>
        <button ref={toggleRef} type="button" className="weather-strip-toggle" aria-expanded={open} aria-controls="weather-details" onClick={() => setOpen(value => !value)}>
          <Icon className={`weather-atmosphere weather-icon-${symbol.includes('rain') ? 'rain' : symbol.includes('snow') ? 'snow' : 'cloud'}`} size={20} aria-hidden="true" />
          <span className="weather-strip-city">{city.name}</span>
          <span className="weather-strip-temperature">{status === 'ready' && snapshot ? `${snapshot.temperature > 0 ? '+' : ''}${Math.round(snapshot.temperature)}°` : status === 'loading' ? 'Загрузка…' : status === 'idle' ? 'Прогноз' : 'Нет данных'}</span>
          <span className="weather-strip-message">{status === 'ready' ? recommendation : status === 'loading' ? 'Уточняем модельный прогноз' : status === 'idle' ? 'Загрузить погоду по вашему запросу' : 'Не удалось получить свежий прогноз'}</span>
          <span className="weather-strip-more">{open ? 'Свернуть' : 'Подробнее'}</span><ChevronDown className="weather-strip-chevron" size={16} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>{open && <motion.div key="weather-details" id="weather-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .32, ease: [.22, 1, .36, 1] }} className="weather-details-shell"><div className="weather-details-inner">
        <div className="weather-wide-topline">
          <div>
            <p className="section-tag">Погода для загородного отдыха</p>
            <h2>Планируйте банный день с учётом погоды</h2>
          </div>
          <label className="weather-city-label">Город
            <select value={cityId} onChange={(event) => changeCity(event.target.value as WeatherCity['id'])} aria-label="Выберите город">
              {weatherCities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
        <div className="weather-request-notice"><p id="weather-request-notice">Прогноз MET Norway подготовлен для двух городов независимо от посещений сайта. По кнопке браузер загрузит общий снимок с BANGER.SU, без прямого обращения к MET и передачи ему вашего IP. Геолокация не используется. <a href="/cookie#section-3">Как загружается прогноз</a>.</p><button type="button" className="weather-retry" aria-describedby="weather-request-notice" disabled={status === 'loading'} onClick={() => void load()}><RefreshCw aria-hidden="true" size={15} />{status === 'loading' ? 'Загрузка прогноза…' : status === 'error' ? 'Повторить запрос' : status === 'ready' ? 'Обновить прогноз' : 'Загрузить прогноз'}</button></div>
        <div className="weather-wide-body" aria-live="polite" aria-busy={status === 'loading'}>
          <div className="weather-time">{clock} · {city.timezone}</div>
          {status === 'loading' && <div className="weather-state"><span className="weather-loader" aria-hidden="true" />Уточняем прогноз для {city.name}…</div>}
          {status === 'idle' && <div className="weather-state"><p>Выберите город и нажмите «Загрузить прогноз». Открытие панели и выбор города не запускают загрузку.</p></div>}
          {status === 'error' && <div className="weather-state"><p>{requestError}</p></div>}
          {status === 'ready' && snapshot && <div className="weather-result">
            <div className="weather-primary"><div className="weather-temp">{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(snapshot.temperature)}°</div><div><p className="weather-condition">{weatherLabel(snapshot.symbol)}</p><p className="weather-meta"><Wind aria-hidden="true" size={15} /> {snapshot.wind.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} м/с {snapshot.precipitation !== undefined && <>· осадки {snapshot.precipitation.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} мм</>}</p></div></div>
            <p className="weather-recommendation">{weatherRecommendation(snapshot, hour)}</p>
          </div>}
        </div>
        <div className="weather-wide-footer">
          <span>{snapshot ? `Прогноз на ${forecastTime} · модель ${new Intl.DateTimeFormat('ru-RU', { timeZone: city.timezone, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(snapshot.updatedAt))} · проверено ${new Intl.DateTimeFormat('ru-RU', { timeZone: city.timezone, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(snapshot.sourceCheckedAt!))}` : 'Температура не показывается без свежего снимка'}</span>
          <span>Модельный прогноз, не измерение метеостанции · <a href={weatherSource.url} target="_blank" rel="noreferrer">MET Norway</a> · <a href={weatherSource.license} target="_blank" rel="noreferrer">CC BY 4.0</a> · обработка и представление — BANGER · <a href={weatherSource.terms} target="_blank" rel="noreferrer">условия сервиса</a></span>
        </div>
        </div></motion.div>}</AnimatePresence>
      </div>
    </div>
  </section>
}
