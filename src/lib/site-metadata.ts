/** Shared Open Graph fields: page metadata replaces, rather than merges, the root object. */
export const defaultOpenGraph = {
  type: 'website' as const,
  locale: 'ru_RU',
  siteName: 'Бани Герасимов',
  images: [{
    url: 'https://banger.su/images/hero/hero-bg.webp',
    width: 1671,
    height: 941,
    alt: 'Бани Герасимов — мобильные бани и дома',
  }],
}
