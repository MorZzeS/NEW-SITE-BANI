import cityData from '@/data/weather-cities.json'

export type WeatherCity = {
  id: string
  name: string
  latitude: number
  longitude: number
  timezone: string
}

export type WeatherSnapshot = {
  cityId: WeatherCity['id']
  temperature: number
  wind: number
  precipitation?: number
  forecastHours?: number
  symbol: string
  forecastTime: string
  updatedAt: string
  fetchedAt: string
  sourceCheckedAt?: string
}

export const weatherCities: WeatherCity[] = [...cityData].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
export const defaultWeatherCity = weatherCities.find(city => city.id === 'moscow')!
export const WEATHER_CITY_STORAGE_KEY = 'banger:weather-city'
export const WEATHER_COVERAGE_KM = 35

/** Only centroid matching, never an address or a claim about municipal boundaries. */
export function nearestSupportedCity(latitude: number, longitude: number, accuracy = 0): WeatherCity | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 10_000) return null
  const radians = (value: number) => value * Math.PI / 180
  let nearest: WeatherCity | null = null
  let shortest = Infinity
  for (const city of weatherCities) {
    const deltaLat = radians(city.latitude - latitude), deltaLon = radians(city.longitude - longitude)
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(latitude)) * Math.cos(radians(city.latitude)) * Math.sin(deltaLon / 2) ** 2
    const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))
    if (distance < shortest) { shortest = distance; nearest = city }
  }
  return shortest + accuracy / 1000 <= WEATHER_COVERAGE_KM ? nearest : null
}

export type WeatherVisualState = 'sun' | 'partcloud' | 'cloud' | 'rain' | 'snow' | 'night'
export function weatherVisualState(symbol: string): WeatherVisualState {
  if (symbol.includes('snow') || symbol.includes('sleet')) return 'snow'
  if (symbol.includes('rain') || symbol.includes('drizzle') || symbol.includes('thunder')) return 'rain'
  if (symbol.includes('clearsky') && symbol.includes('_night')) return 'night'
  if (symbol.includes('clearsky')) return 'sun'
  if (symbol.includes('fair') || symbol.includes('partlycloudy')) return 'partcloud'
  return 'cloud'
}

export const weatherSource = {
  name: 'MET Norway',
  url: 'https://api.met.no/',
  terms: 'https://api.met.no/doc/TermsOfService',
  license: 'https://creativecommons.org/licenses/by/4.0/',
}

/** Static common forecast; the browser never contacts its upstream provider. */
export function readWeatherSnapshot(raw: any, city: WeatherCity, now = Date.now()): WeatherSnapshot {
  const checked = Date.parse(raw?.checkedAt)
  const updated = Date.parse(raw?.forecast?.properties?.meta?.updated_at)
  if (raw?.schema !== 1 || raw?.available !== true || raw.cityId !== city.id || !Number.isFinite(checked) || !Number.isFinite(updated) || now - checked > 2 * 60 * 60_000 || checked - now > 5 * 60_000 || now - updated > 12 * 60 * 60_000 || updated - now > 5 * 60_000) throw new Error('Weather snapshot is unavailable or stale')
  return { ...nearestForecast(raw.forecast, city, now), sourceCheckedAt: raw.checkedAt }
}

export function nearestForecast(raw: any, city: WeatherCity, now = Date.now()): WeatherSnapshot {
  const series = raw?.properties?.timeseries
  if (!Array.isArray(series) || !series.length) throw new Error('Forecast is unavailable')
  const valid = series.filter((item: any) => Number.isFinite(Date.parse(item?.time)))
  if (!valid.length) throw new Error('Forecast is unavailable')
  const point = valid.reduce((best: any, item: any) => Math.abs(Date.parse(item.time) - now) < Math.abs(Date.parse(best.time) - now) ? item : best)
  const forecastMs = Date.parse(point.time)
  if (Math.abs(forecastMs - now) > 90 * 60_000) throw new Error('Forecast is stale')
  const instant = point.data?.instant?.details
  const next = point.data?.next_1_hours ?? point.data?.next_6_hours ?? point.data?.next_12_hours
  const details = next?.details ?? {}
  const temperature = instant?.air_temperature
  const wind = instant?.wind_speed
  const precipitation = details?.precipitation_amount
  const symbol = String(next?.summary?.symbol_code ?? '')
  if (typeof temperature !== 'number' || !Number.isFinite(temperature) || typeof wind !== 'number' || !Number.isFinite(wind) || (precipitation !== undefined && (typeof precipitation !== 'number' || !Number.isFinite(precipitation))) || !symbol) throw new Error('Forecast is incomplete')
  return { cityId: city.id, temperature, wind, precipitation, forecastHours: point.data?.next_1_hours ? 1 : point.data?.next_6_hours ? 6 : 12, symbol, forecastTime: point.time, updatedAt: raw.properties?.meta?.updated_at ?? point.time, fetchedAt: new Date(now).toISOString() }
}

export function weatherLabel(symbol: string) {
  if (symbol.includes('thunder')) return 'Возможна гроза'
  if (symbol.includes('snow')) return 'Возможен снег'
  if (symbol.includes('sleet')) return 'Возможен мокрый снег'
  if (symbol.includes('rain') || symbol.includes('drizzle')) return 'Возможен дождь'
  if (symbol.includes('fog')) return 'Возможен туман'
  if (symbol.includes('clearsky')) return 'Ясно'
  if (symbol.includes('fair')) return 'Малооблачно'
  if (symbol.includes('cloud')) return 'Облачно'
  return 'Условия по модельному прогнозу'
}

export function weatherRecommendation(snapshot: WeatherSnapshot, hour: number) {
  const symbol = snapshot.symbol.toLowerCase()
  const part = hour < 6 || hour >= 23 ? 'ночь' : hour < 12 ? 'утро' : hour < 18 ? 'день' : 'вечер'
  if (symbol.includes('thunder') || snapshot.wind >= 15) return 'При грозе или сильном ветре не планируйте дальнюю поездку ради бани. Учитывайте местные условия.'
  if (symbol.includes('snow') || symbol.includes('sleet')) return 'Зимняя погода создаёт особенную атмосферу. Планируйте поездку с учётом состояния дорог.'
  if (symbol.includes('rain') || symbol.includes('drizzle')) {
    const rest = part === 'ночь' ? 'уютную ночь' : part === 'утро' ? 'уютное утро' : part === 'вечер' ? 'уютный вечер' : 'уютный день'
    return `Возможен дождь — хороший повод устроить ${rest} в бане и никуда не спешить.`
  }
  if (snapshot.temperature >= 18 && (symbol.includes('clearsky') || symbol.includes('fair'))) return hour >= 18 || hour < 6 ? 'Тёплая погода располагает к спокойному отдыху на участке и вечеру в бане.' : 'Подходящая погода для отдыха на участке. Ближе к вечеру можно затопить баню.'
  if (snapshot.temperature < 10) return `На улице свежо. Особенно приятно провести ${part} в тёплой бане и отдохнуть от повседневных дел.`
  return 'Планируйте загородный отдых в бане в спокойном темпе с учётом погоды и условий на участке.'
}
