import manifest from './projects.json'

export type ProjectMedia = {
  id: string
  src: string
  alt: string
  caption: string
  kind: 'catalog-render' | 'photo'
  order: number
  focalPoint: { x: number; y: number }
}

export type PortfolioRecord = {
  id: string
  slug: string
  title: string
  model: string
  description: string
  order: number
  visible: boolean
  evidence: 'illustrative' | 'owner-confirmed'
  coverMediaId: string
  characteristics: { label: string; value: string }[]
  media: ProjectMedia[]
}

// One editable content source. No per-component photo/title/order configuration.
const records: PortfolioRecord[] = manifest.items as PortfolioRecord[]
export const homepagePortfolioModels = manifest.homepageModelSlugs
export const projects = records.filter(item => item.visible).sort((a, b) => a.order - b.order).map(item => {
  const cover = item.media.find(media => media.id === item.coverMediaId)
  if (!cover) throw new Error(`Portfolio cover missing: ${item.id}`)
  if (new Set(item.media.map(media => media.id)).size !== item.media.length) throw new Error(`Duplicate portfolio media: ${item.id}`)
  const media = [...item.media].sort((a, b) => a.order - b.order)
  return { ...item, cover, media, image: cover.src, gallery: media.filter(media => media.id !== cover.id) }
})

export function projectMediaStyle(media: ProjectMedia) {
  return { objectPosition: `${media.focalPoint.x}% ${media.focalPoint.y}%` }
}
