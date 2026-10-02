import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог мобильных домов — серия Усадьба',
  description: 'Мобильные дома серии Усадьба: Практик, Простор, Веранда, Терра 7. Двухмодульный формат до 32 м². Цены от 1 328 600 ₽. Доставка по Москве и Московской области.',
  alternates: { canonical: 'https://banger.su/katalog/doma' },
  openGraph: {
    url: 'https://banger.su/katalog/doma',
    title: 'Каталог мобильных домов — Бани Герасимов',
    description: 'Мобильные дома серии Усадьба. Доставка по Москве и МО.',
  },
}

export default function DomaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
