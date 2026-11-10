import { leadDocumentBundle } from './lead-consent'
import { isOnlineLeadReleaseReady } from './lead-release-gate'

/** A URL by itself is not approval to render a form that collects personal data. */
const leadsEndpointConfigured = isOnlineLeadReleaseReady(
  process.env.NEXT_PUBLIC_LEADS_ENDPOINT,
  process.env.NEXT_PUBLIC_LEADS_CONTRACT,
  leadDocumentBundle,
)

export const releasePolicy = Object.freeze({
  profile: leadsEndpointConfigured ? 'online-leads' : 'visual-contacts',
  onlineLeads: leadsEndpointConfigured,
  analytics: false,
  weather: 'disabled',
  weatherTransport: 'none',
  embeddedYandex: true,
  promotionalOffer: true,
} as const)
