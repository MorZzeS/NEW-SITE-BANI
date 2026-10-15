// Keep homepage media separate from transition logic for future photo replacement.
export const homepageHeroImages = {
  light: '/images/hero/hero-day.webp',
  dark: '/images/hero/hero-night.webp',
} as const

export const homepageBestSellerSlug = 'skandinaviya-start-65'
export const homepagePopularIds = ['bg-01', 'bg-11', 'bg-04', 'bg-05'] as const

// Approved Glass Reveal copy: docs/ux/homepage-20261014/content.js.
export const homepageTrustItems = [
  {
    id: 'production',
    title: 'Производство',
    caption: 'Собственное производство',
    detail: 'Конструкцию и комплектацию выбранной модели можно обсудить до заказа.',
  },
  {
    id: 'delivery',
    title: 'Доставка',
    caption: 'Москва и Московская область',
    detail: 'Адрес участка и особенности подъезда помогают уточнить условия доставки.',
  },
  {
    id: 'installation',
    title: 'Установка',
    caption: 'Подготовка и монтаж',
    detail: 'Подготовку площадки и монтаж следует согласовать с учётом вашего участка.',
  },
  {
    id: 'warranty',
    title: 'Гарантия',
    caption: 'По договору',
    detail: 'Перед заказом ознакомьтесь с обязательствами и гарантийными условиями договора.',
  },
] as const
