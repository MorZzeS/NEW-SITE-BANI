import { leadDocumentBundle } from './lead-consent'
import { isOnlineLeadReleaseReady } from './lead-release-gate'

/** A URL by itself is not approval to render a form that collects personal data. */
const isGitHubPagesProject = process.env.BANGER_GITHUB_PAGES === 'true'
const leadsEndpointConfigured = !isGitHubPagesProject && isOnlineLeadReleaseReady(
  process.env.NEXT_PUBLIC_LEADS_ENDPOINT,
  process.env.NEXT_PUBLIC_LEADS_CONTRACT,
  leadDocumentBundle,
)
const analyticsConfigured = !isGitHubPagesProject
  && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
  && process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() === '111684946'
const modelViewsConfigured = !isGitHubPagesProject
  && process.env.NEXT_PUBLIC_MODEL_VIEWS_ENABLED === 'true'

export const releasePolicy = Object.freeze({
  profile: leadsEndpointConfigured ? 'online-leads' : 'visual-contacts',
  onlineLeads: leadsEndpointConfigured,
  analytics: analyticsConfigured,
  /** Server-persisted counters stay off until the SpaceWeb endpoint and DB migration are approved. */
  modelViews: modelViewsConfigured,
  /** Owner-approved supplied color renders are available on supported model cards. */
  /** Webvisor is available only after an additional visitor choice at runtime. */
  webvisor: analyticsConfigured,
  weather: 'disabled',
  weatherTransport: 'none',
  embeddedYandex: 'automatic',
  promotionalOffer: true,
} as const)
