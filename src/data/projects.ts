import manifest from './projects.json'

export type ProjectMedia = {
  id: string
  src: string
  thumbnail: string
  alt: string
  caption: string
  kind: 'catalog-render' | 'photo'
  order: number
  width: number
  height: number
  focalPoint: { x: number; y: number }
}

export type PortfolioRecord = {
  id: string
  slug: string
  title: string
  model?: string
  description: string
  order: number
  visible: boolean
  evidence: 'illustrative' | 'owner-confirmed'
  coverMediaId: string
  characteristics: { label: string; value: string }[]
  media: ProjectMedia[]
  pageHeading?: string
  caseType?: 'client-case' | 'showroom-example'
  clientCase?: {
    size: string
    base: string
    duration: string
    selectedExtras: string[]
    ownerFeedback: string
  }
  temporaryNote?: string
  cardDescription?: string
}

// One editable content source. No per-component photo/title/order configuration.
const records: PortfolioRecord[] = manifest.items as unknown as PortfolioRecord[]
export const homepagePortfolioModels = manifest.homepageModelSlugs
function prepare(item: PortfolioRecord) {
  const cover = item.media.find(media => media.id === item.coverMediaId)
  if (!cover) throw new Error(`Portfolio cover missing: ${item.id}`)
  if (new Set(item.media.map(media => media.id)).size !== item.media.length) throw new Error(`Duplicate portfolio media: ${item.id}`)
  const media = [...item.media].sort((a, b) => a.order - b.order).map(entry => ({
    ...entry,
    thumbnail: entry.thumbnail || entry.src,
    width: entry.width || 1920,
    height: entry.height || 1080,
  }))
  return { ...item, cover, media, image: cover.src, gallery: media.filter(media => media.id !== cover.id) }
}

// Keep hidden legacy detail routes buildable while rendering only visible records in portfolio listings.
export const allProjects = records.sort((a, b) => a.order - b.order).map(prepare)
export const projects = allProjects.filter(item => item.visible)

export function findProject(slug: string) {
  return allProjects.find(project => project.slug === slug)
}

export function projectMediaStyle(media: ProjectMedia) {
  return { objectPosition: `${media.focalPoint.x}% ${media.focalPoint.y}%` }
}
