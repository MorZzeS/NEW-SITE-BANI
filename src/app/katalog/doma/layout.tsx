import type { Metadata } from 'next'
import { homes, formatPrice } from '@/data'

export const metadata: Metadata = {
  title: 'Каталог мобильных домов — серия Усадьба',
  description: `Мобильные дома серии Усадьба: Практик, Простор, Веранда, Терра 7. Двухмодульный формат до 32 м². Цены от ${formatPrice(Math.min(...homes.map(model => model.priceFrom)))}. Доставка по Москве и регионам Центральной России.`,
  alternates: { canonical: 'https://banger.su/katalog/doma' },
  openGraph: {
    url: 'https://banger.su/katalog/doma',
    title: 'Каталог мобильных домов — Бани Герасимов',
    description: 'Мобильные дома серии Усадьба. Доставка по Москве и регионам Центральной России.',
  },
}

export default function DomaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
