/**
 * Production integrations stay explicitly gated. The online lead form is mounted only when an
 * owner-approved HTTPS endpoint is supplied at build time (test Pages workflow), so a build
 * without that variable keeps the honest contact-only fallback and cannot collect data.
 */
const leadsEndpointConfigured = /^https:\/\//.test(process.env.NEXT_PUBLIC_LEADS_ENDPOINT || '')

export const releasePolicy = Object.freeze({
  profile: leadsEndpointConfigured ? 'online-leads' : 'visual-contacts',
  onlineLeads: leadsEndpointConfigured,
  analytics: false,
  weather: 'disabled',
  weatherTransport: 'none',
  embeddedYandex: true,
  promotionalOffer: true,
} as const)
