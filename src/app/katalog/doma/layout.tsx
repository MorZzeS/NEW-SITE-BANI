import { defaultOpenGraph } from '@/lib/site-metadata'
import type { Metadata } from 'next'
import { publishedHomes as homes, formatPrice } from '@/data'
import { modelCountWord } from '@/lib/catalog-labels'

const homeCount = homes.length
const homeCountLabel = modelCountWord(homeCount)

export const metadata: Metadata = {
  title: homeCount ? 'Каталог мобильных домов — серия Усадьба' : 'Модели мобильных домов временно недоступны',
  ...(homeCount ? {} : { robots: { index: false, follow: true } }),
  description: homeCount ? `${homeCount} ${homeCountLabel} мобильных домов серии Усадьба. Двухмодульный формат до 32 м². Цены от ${formatPrice(Math.min(...homes.map(model => model.priceFrom)))}. Доставка по Москве и регионам Центральной России.` : 'Модели мобильных домов временно недоступны. Актуальные модели бань представлены в каталоге.',
  alternates: { canonical: 'https://banger.su/katalog/doma' },
  openGraph: { ...defaultOpenGraph,
    url: 'https://banger.su/katalog/doma',
    title: 'Каталог мобильных домов — Бани Герасимов',
    description: homeCount ? `${homeCount} ${homeCountLabel} мобильных домов серии Усадьба. Доставка по Москве и регионам Центральной России.` : 'Модели мобильных домов временно недоступны. Посмотрите актуальный каталог бань.',
  },
}

export default function DomaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
