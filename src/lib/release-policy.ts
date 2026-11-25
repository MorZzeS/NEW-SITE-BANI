import { leadDocumentBundle } from './lead-consent'
import { isOnlineLeadReleaseReady } from './lead-release-gate'

/** A URL by itself is not approval to render a form that collects personal data. */
const leadsEndpointConfigured = isOnlineLeadReleaseReady(
  process.env.NEXT_PUBLIC_LEADS_ENDPOINT,
  process.env.NEXT_PUBLIC_LEADS_CONTRACT,
  leadDocumentBundle,
)
const analyticsConfigured = process.env.BANGER_GITHUB_PAGES !== 'true'
  && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
  && process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() === '111684946'

export const releasePolicy = Object.freeze({
  profile: leadsEndpointConfigured ? 'online-leads' : 'visual-contacts',
  onlineLeads: leadsEndpointConfigured,
  analytics: analyticsConfigured,
  /** Webvisor is available only after an additional visitor choice at runtime. */
  webvisor: analyticsConfigured,
  weather: 'disabled',
  weatherTransport: 'none',
  embeddedYandex: 'automatic',
  promotionalOffer: true,
} as const)
