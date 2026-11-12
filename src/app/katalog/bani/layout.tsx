import { defaultOpenGraph } from '@/lib/site-metadata'
import type { Metadata } from 'next'
import { saunas, formatPrice } from '@/data'
import { modelCountWord } from '@/lib/catalog-labels'

const saunaCount = saunas.length
const saunaCountLabel = modelCountWord(saunaCount)

export const metadata: Metadata = {
  title: `Каталог мобильных бань — ${saunaCount} ${saunaCountLabel} — серии Исток, Север, Скандинавия`,
  description: `${saunaCount} ${saunaCountLabel} мобильных бань собственного производства. Серии Исток, Север, Скандинавия. Цены от ${formatPrice(Math.min(...saunas.map(model => model.priceFrom)))}. Доставка и установка по Москве и регионам Центральной России.`,
  alternates: { canonical: 'https://banger.su/katalog/bani' },
  openGraph: { ...defaultOpenGraph,
    url: 'https://banger.su/katalog/bani',
    title: `Каталог мобильных бань — ${saunaCount} ${saunaCountLabel} — Бани Герасимов`,
    description: `${saunaCount} ${saunaCountLabel} мобильных бань. Серии Исток, Север, Скандинавия. Доставка по Москве и регионам Центральной России.`,
  },
}

export default function BaniLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
