/** Contacts stay local; common forecasts are served from this site only. */
export const releasePolicy = Object.freeze({
  profile: 'visual-contacts',
  onlineLeads: false,
  analytics: false,
  weather: 'same-origin',
  weatherTransport: 'same-origin-snapshot',
  embeddedYandex: false,
  promotionalOffer: true,
} as const)
