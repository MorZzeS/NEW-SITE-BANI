import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог мобильных бань — серии Исток, Север, Скандинавия',
  description: `24 модели мобильных бань собственного производства. Серии Исток, Север, Скандинавия. Размеры 4–8 м. Цены от 357 500 ₽. Доставка и установка по Москве и Московской области.`,
  alternates: { canonical: 'https://banger.su/katalog/bani' },
  openGraph: {
    url: 'https://banger.su/katalog/bani',
    title: 'Каталог мобильных бань — Бани Герасимов',
    description: '24 модели мобильных бань. Серии Исток, Север, Скандинавия. Доставка по Москве и МО.',
  },
}

export default function BaniLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
