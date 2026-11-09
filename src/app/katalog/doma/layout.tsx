import type { Metadata } from 'next'
import { homes, formatPrice } from '@/data'
import { modelCountWord } from '@/lib/catalog-labels'

const homeCount = homes.length
const homeCountLabel = modelCountWord(homeCount)

export const metadata: Metadata = {
  title: 'Каталог мобильных домов — серия Усадьба',
  description: `${homeCount} ${homeCountLabel} мобильных домов серии Усадьба. Двухмодульный формат до 32 м². Цены от ${formatPrice(Math.min(...homes.map(model => model.priceFrom)))}. Доставка по Москве и регионам Центральной России.`,
  alternates: { canonical: 'https://banger.su/katalog/doma' },
  openGraph: {
    url: 'https://banger.su/katalog/doma',
    title: 'Каталог мобильных домов — Бани Герасимов',
    description: `${homeCount} ${homeCountLabel} мобильных домов серии Усадьба. Доставка по Москве и регионам Центральной России.`,
  },
}

export default function DomaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
