import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const cities = JSON.parse(fs.readFileSync(new URL('../src/data/weather-cities.json', import.meta.url), 'utf8'))
const source = fs.readFileSync(new URL('../src/lib/weather.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
const context = { exports: {}, require: name => { assert.equal(name, '@/data/weather-cities.json'); return cities } }
vm.runInNewContext(compiled, context)
const weather = context.exports
const now = Date.parse('2026-10-27T09:00:00Z')
function snapshot(city = weather.defaultWeatherCity) {
  return { schema: 1, available: true, cityId: city.id, checkedAt: new Date(now).toISOString(), forecast: { properties: { meta: { updated_at: new Date(now).toISOString() }, timeseries: [{ time: new Date(now).toISOString(), data: { instant: { details: { air_temperature: 4, wind_speed: 3 } }, next_6_hours: { summary: { symbol_code: 'rain' }, details: { precipitation_amount: 2 } } } }] } } }
}

test('fixed real centroid catalogue is unique, Russian sorted, and defaults to Moscow', () => {
  assert(cities.length >= 30 && cities.length <= 60)
  assert.equal(new Set(cities.map(city => city.id)).size, cities.length)
  assert.equal(new Set(cities.map(city => `${city.latitude},${city.longitude}`)).size, cities.length)
  assert(cities.every(city => city.sourceUrl === `https://www.geonames.org/${city.geonamesId}/` && city.region && city.timezone === 'Europe/Moscow'))
  assert.equal(weather.defaultWeatherCity.id, 'moscow')
  assert.deepEqual(Array.from(weather.weatherCities, city => city.name), cities.map(city => city.name).sort((a, b) => a.localeCompare(b, 'ru')))
})

test('nearest-city matching is local, bounded, accuracy-aware and rejects unsupported positions', () => {
  const city = cities.find(item => item.id === 'ramenskoe')
  assert.equal(weather.nearestSupportedCity(city.latitude, city.longitude, 100).id, city.id)
  assert.equal(weather.nearestSupportedCity(0, 0, 10), null)
  assert.equal(weather.nearestSupportedCity(city.latitude, city.longitude, 10001), null)
  assert.equal(weather.nearestSupportedCity(NaN, city.longitude), null)
  assert.equal(weather.nearestSupportedCity(91, 37), null)
  assert.equal(weather.nearestSupportedCity(city.latitude, city.longitude, -1), null)
})

test('all six illustrations follow real symbols and clear night is independent of theme', () => {
  for (const [symbol, state] of [['clearsky_day','sun'],['partlycloudy_day','partcloud'],['cloudy','cloud'],['lightrain','rain'],['snow','snow'],['clearsky_night','night'],['fair_night','partcloud'],['sleet','snow'],['rainandthunder','rain']]) assert.equal(weather.weatherVisualState(symbol), state)
})

test('actual forecast interval is preserved and mismatched, stale or incomplete forecasts fail closed', () => {
  const raw = snapshot()
  const parsed = weather.readWeatherSnapshot(raw, weather.defaultWeatherCity, now)
  assert.equal(parsed.forecastHours, 6)
  assert.equal(parsed.temperature, 4)
  assert.equal(parsed.precipitation, 2)
  assert.throws(() => weather.readWeatherSnapshot({ ...raw, cityId: 'tula' }, weather.defaultWeatherCity, now))
  assert.throws(() => weather.readWeatherSnapshot({ ...raw, checkedAt: new Date(now - 121 * 60_000).toISOString() }, weather.defaultWeatherCity, now))
  const stale = structuredClone(raw)
  stale.forecast.properties.meta.updated_at = new Date(now - 13 * 60 * 60_000).toISOString()
  assert.throws(() => weather.readWeatherSnapshot(stale, weather.defaultWeatherCity, now))
  const oldPoint = structuredClone(raw)
  oldPoint.forecast.properties.timeseries[0].time = new Date(now - 91 * 60_000).toISOString()
  assert.throws(() => weather.readWeatherSnapshot(oldPoint, weather.defaultWeatherCity, now))
  const incomplete = structuredClone(raw)
  incomplete.forecast.properties.timeseries[0].data.instant.details.wind_speed = null
  assert.throws(() => weather.readWeatherSnapshot(incomplete, weather.defaultWeatherCity, now))
})
