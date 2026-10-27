import type { Metadata } from 'next'
import { saunas, formatPrice } from '@/data'

export const metadata: Metadata = {
  title: 'Каталог мобильных бань — серии Исток, Север, Скандинавия',
  description: `24 модели мобильных бань собственного производства. Серии Исток, Север, Скандинавия. Размеры 4–8 м. Цены от ${formatPrice(Math.min(...saunas.map(model => model.priceFrom)))}. Доставка и установка по Москве и регионам Центральной России.`,
  alternates: { canonical: 'https://banger.su/katalog/bani' },
  openGraph: {
    url: 'https://banger.su/katalog/bani',
    title: 'Каталог мобильных бань — Бани Герасимов',
    description: '24 модели мобильных бань. Серии Исток, Север, Скандинавия. Доставка по Москве и регионам Центральной России.',
  },
}

export default function BaniLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
