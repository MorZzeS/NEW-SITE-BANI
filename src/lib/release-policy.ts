/** Production integrations stay explicitly gated; weather is temporarily hidden pending redesign. */
export const releasePolicy = Object.freeze({
  profile: 'visual-contacts',
  onlineLeads: false,
  analytics: false,
  weather: 'disabled',
  weatherTransport: 'none',
  embeddedYandex: false,
  promotionalOffer: true,
} as const)
