// ─── Product Types ───
export interface ProductSpec {
  label: string
  value: string
}

export interface Sauna {
  id: string
  slug: string
  name: string
  series: 'Исток' | 'Север' | 'Скандинавия' | 'Барн' | 'Усадьба'
  subtitle: string
  description: string
  image: string
  images: string[]
  interiorImages?: string[]
  floorPlan?: string
  size: string       // e.g. "6×2.5 м"
  area: number       // m²
  rooms?: number
  priceFrom: number
  priceVariants?: string[]
  priceLabel?: string
  article?: string
  collection?: string
  tags: string[]     // ['Хит', 'Новинка', 'В наличии', 'Под заказ']
  specs: ProductSpec[]
  features: string[]
  isPopular?: boolean
  hasBathroom?: boolean; hasTerrace?: boolean; hasShower?: boolean
}

export interface Home {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  image: string
  images: string[]
  interiorImages?: string[]
  floorPlan?: string
  size: string
  area: number
  rooms?: number
  sleepingPlaces?: number
  priceFrom: number
  priceVariants?: string[]
  priceLabel?: string
  tags: string[]
  article?: string
  specs: ProductSpec[]
  features: string[]
  isPopular?: boolean
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: number
  image?: string
  imageAvif?: string
  imageAlt?: string
  imageCaption?: string
  content: string
  seoTitle?: string
  metaDescription?: string
  toc?: { id: string; title: string; level: number }[]
  photoBrief?: string
  relatedSlugs?: string[]
  resourceLinks?: { href: string; label: string }[]
}

export interface Project {
  id: string
  slug: string
  title: string
  model: string
  region: string
  date: string
  description: string
  image: string
  images: string[]
  tags: string[]
}

export interface SiteSettings {
  phone: string; phoneDisplay: string
  phone2?: string; phoneDisplay2?: string
  email: string
  address: string; addressShowroom?: string
  telegram: string; whatsapp?: string; max?: string; vk: string; youtube: string
  workingHours: string
}
