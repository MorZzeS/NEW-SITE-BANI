import { weatherVisualState } from '@/lib/weather'

/** Small local SVG; state follows the provider's symbol, independently of the site theme. */
export function WeatherVisual({ symbol, compact = false }: { symbol: string; compact?: boolean }) {
  const state = weatherVisualState(symbol)
  const night = symbol.includes('_night')
  const cloud = state === 'cloud' || state === 'partcloud' || state === 'rain' || state === 'snow'
  return <svg viewBox="0 0 120 100" fill="none" aria-hidden="true" className={`weather-visual weather-visual-${state}${compact ? ' weather-visual-compact' : ''}`}>
    {(state === 'sun' || state === 'partcloud') && !night && <g className="weather-visual-light" stroke="#E5B75F" strokeWidth="3" strokeLinecap="round"><circle cx="46" cy="35" r="16" fill="#E5B75F" fillOpacity=".18" /><path d="M46 9v-5m0 62v-5M20 35h-5m62 0h-5M28 17l-4-4m44 44-4-4m0-36 4-4M28 53l-4 4" /></g>}
    {(state === 'night' || state === 'partcloud' && night) && <g stroke="#D8C8AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M61 12a27 27 0 1 0 25 36C66 54 47 36 61 12Z" fill="#D8C8AA" fillOpacity=".12" /><path d="M91 15v10m-5-5h10m-4 18h4" /></g>}
    {cloud && <path className="weather-visual-cloud" d="M30 67a16 16 0 0 1-2-32 24 24 0 0 1 45-5 19 19 0 1 1 12 37H30Z" stroke="currentColor" strokeWidth="3" fill="var(--color-surface-2)" />}
    {state === 'rain' && <path className="weather-visual-fall" d="m37 77-4 9m23-9-4 9m23-9-4 9" stroke="#85A6BD" strokeWidth="3" strokeLinecap="round" />}
    {state === 'snow' && <g className="weather-visual-fall" stroke="#A7C3D2" strokeWidth="2" strokeLinecap="round"><path d="M35 77v12m-5-9 10 6m0-6-10 6m30-9v12m-5-9 10 6m0-6-10 6m30-9v12m-5-9 10 6m0-6-10 6" /></g>}
  </svg>
}
