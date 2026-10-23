/** Reviewed visual release: enabling collection requires a separate release. */
export const releasePolicy = Object.freeze({
  profile: 'visual-contacts',
  onlineLeads: false,
  analytics: false,
  weather: false,
  embeddedYandex: false,
  promotionalOffer: false,
} as const)
