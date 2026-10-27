export const SITE_PREFERENCES_KEY = 'banger:site-preferences:v1'
export const WEATHER_CITY_KEY = 'banger:weather-city'
export const PREFERENCES_EVENT = 'banger:preferences-changed'
export type SitePreferences = { version: 1; rememberWeatherCity: boolean }

export function getSitePreferences(): SitePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const value = JSON.parse(localStorage.getItem(SITE_PREFERENCES_KEY) || 'null')
    return value?.version === 1 && typeof value.rememberWeatherCity === 'boolean'
      ? { version: 1, rememberWeatherCity: value.rememberWeatherCity } : null
  } catch { return null }
}

/** Persists only the visitor's preference; this never starts analytics or a request. */
export function setSitePreferences(rememberWeatherCity: boolean): boolean {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(SITE_PREFERENCES_KEY, JSON.stringify({ version: 1, rememberWeatherCity }))
    if (!rememberWeatherCity) localStorage.removeItem(WEATHER_CITY_KEY)
    window.dispatchEvent(new Event(PREFERENCES_EVENT))
    return true
  } catch { return false }
}
