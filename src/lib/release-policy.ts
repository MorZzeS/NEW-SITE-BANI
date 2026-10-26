/** Contacts stay local; weather requires an explicit, informed request. */
export const releasePolicy = Object.freeze({
  profile: 'visual-contacts',
  onlineLeads: false,
  analytics: false,
  weather: 'on-request',
  weatherTransport: 'same-origin-snapshot',
  embeddedYandex: false,
  promotionalOffer: true,
} as const)
