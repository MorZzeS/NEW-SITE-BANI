import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Build-time collection only. Never accepts a visitor request, city or headers.
export const cities = Object.freeze([
  { id: 'ramenskoe', latitude: 55.5675, longitude: 38.225 },
  { id: 'moscow', latitude: 55.7558, longitude: 37.6173 },
])
const USER_AGENT = 'BANGER.SU/1.0 https://banger.su/ banger.su@bk.ru'
const MAX_MODEL_AGE = 12 * 60 * 60_000

export async function refreshWeather({ output = 'dist/weather', cache = '.next/cache/weather', fetchImpl = fetch, now = Date.now() } = {}) {
  await fs.mkdir(output, { recursive: true })
  await fs.mkdir(cache, { recursive: true })
  const results = []
  for (const city of cities) {
    const cachePath = path.join(cache, `${city.id}.json`)
    let previous
    try { previous = JSON.parse(await fs.readFile(cachePath, 'utf8')) } catch { /* first collection */ }
    let snapshot
    let nextAllowed = 0
    try {
      if (previous?.schema === 1 && Date.parse(previous.expiresAt) > now) {
        snapshot = previous
      } else {
        const headers = { 'User-Agent': USER_AGENT, Accept: 'application/json' }
        if (previous?.lastModified) headers['If-Modified-Since'] = previous.lastModified
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${city.latitude}&lon=${city.longitude}`
        const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(10_000), redirect: 'error' })
        const expiry = Date.parse(response.headers.get('expires') || '')
        nextAllowed = Number.isFinite(expiry) && expiry > now ? expiry : now + 60 * 60_000
        let forecast
        if (response.status === 304 && previous?.forecast) forecast = previous.forecast
        else if (response.status === 200) forecast = await response.json()
        else throw new Error('Provider unavailable')
        const updated = Date.parse(forecast?.properties?.meta?.updated_at)
        if (!Number.isFinite(updated) || now - updated > MAX_MODEL_AGE || updated - now > 5 * 60_000 || !forecast?.properties?.timeseries?.length) throw new Error('Invalid or stale model')
        snapshot = { schema: 1, available: true, cityId: city.id, checkedAt: new Date(now).toISOString(), expiresAt: new Date(nextAllowed).toISOString(), lastModified: response.headers.get('last-modified') || previous?.lastModified || new Date(updated).toUTCString(), forecast }
        await fs.writeFile(cachePath, JSON.stringify(snapshot))
      }
      const modelAge = now - Date.parse(snapshot.forecast?.properties?.meta?.updated_at)
      if (snapshot.available !== true || !Number.isFinite(modelAge) || modelAge > MAX_MODEL_AGE || now - Date.parse(snapshot.checkedAt) >= 2 * 60 * 60_000) throw new Error('Cached model stale')
    } catch {
      if (nextAllowed > now) await fs.writeFile(cachePath, JSON.stringify({ schema: 1, available: false, cityId: city.id, checkedAt: null, expiresAt: new Date(nextAllowed).toISOString() }))
      // Publish an honest unavailable state, never relabel an old model as fresh.
      snapshot = { schema: 1, available: false, cityId: city.id, checkedAt: null }
    }
    await fs.writeFile(path.join(output, `${city.id}.json`), JSON.stringify(snapshot) + '\n')
    results.push({ city: city.id, available: snapshot.available, checkedAt: snapshot.checkedAt })
  }
  return results
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ weatherCollection: await refreshWeather(), visitorDataReceived: false }))
}
