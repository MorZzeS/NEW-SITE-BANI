const STATIC_ANALYTICS_PATHS = new Set([
  '/',
  '/cookie', '/dostavka-i-ustanovka', '/garantiya', '/kak-ustroeno',
  '/katalog', '/katalog/bani', '/katalog/doma', '/komplektaciya', '/kontakty',
  '/nashi-raboty', '/o-kompanii', '/obrazec-dogovora', '/oplata-i-cheki',
  '/planirovki', '/poleznoe', '/politika', '/privacy', '/rekvizity',
  '/soglasie-pd', '/soglasie-reklama', '/test-leads', '/usloviya-zakaza', '/vystavka',
])

export function cleanInternalPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  const path = value.split(/[?#]/, 1)[0] || '/'
  return path.length > 1 ? path.replace(/\/+$/, '') || '/' : '/'
}

export type AnalyticsRouteGoal = 'model_view' | 'project_view'

export function analyticsRouteGoal(value: string | null | undefined): AnalyticsRouteGoal | null {
  const path = cleanInternalPath(value)
  if (/^\/(?:banya|dom)\/[^/]+$/.test(path)) return 'model_view'
  if (/^\/nashi-raboty\/[^/]+$/.test(path) && path !== '/nashi-raboty/banya-6x26-proekt-klienta') return 'project_view'
  return null
}

/** Only known static paths or generic dynamic-route labels are sent to analytics. */
export function safeAnalyticsPath(value: string | null | undefined): string {
  const path = cleanInternalPath(value)
  if (STATIC_ANALYTICS_PATHS.has(path)) return path
  if (/^\/banya\/[^/]+$/.test(path)) return '/banya/model'
  if (/^\/dom\/[^/]+$/.test(path)) return '/dom/model'
  if (/^\/nashi-raboty\/[^/]+$/.test(path)) return '/nashi-raboty/project'
  if (/^\/poleznoe\/[^/]+$/.test(path)) return '/poleznoe/article'
  if (/^\/model-sheet\/[^/]+$/.test(path)) return '/model-sheet'
  return '/other'
}

/** External referrers retain only their origin; same-site referrers use a safe route label. */
export function safeAnalyticsReferer(value: string, siteOrigin: string): string {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    const path = url.origin === siteOrigin ? safeAnalyticsPath(url.pathname) : '/'
    return `${url.origin}${path}`
  } catch {
    return ''
  }
}
