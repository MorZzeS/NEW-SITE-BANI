export type WeatherCity = {
  id: 'ramenskoe' | 'moscow'
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
  symbol: string
  forecastTime: string
  updatedAt: string
  fetchedAt: string
}

export const weatherCities: WeatherCity[] = [
  { id: 'ramenskoe', name: 'Раменское', latitude: 55.5675, longitude: 38.225, timezone: 'Europe/Moscow' },
  { id: 'moscow', name: 'Москва', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
]

export const weatherSource = {
  name: 'MET Norway',
  url: 'https://api.met.no/',
  terms: 'https://api.met.no/doc/TermsOfService',
  license: 'https://creativecommons.org/licenses/by/4.0/',
}

export function nearestForecast(raw: any, city: WeatherCity, now = Date.now()): WeatherSnapshot {
  const series = raw?.properties?.timeseries
  if (!Array.isArray(series) || !series.length) throw new Error('Forecast is unavailable')
  const valid = series.filter((item: any) => Number.isFinite(Date.parse(item?.time)))
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
  return { cityId: city.id, temperature, wind, precipitation, symbol, forecastTime: point.time, updatedAt: raw.properties?.meta?.updated_at ?? point.time, fetchedAt: new Date(now).toISOString() }
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
