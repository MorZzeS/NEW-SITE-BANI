import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Каталог мобильных бань — Бани Герасимов',
  description: '24 модели мобильных бань собственного производства.',
  alternates: { canonical: 'https://banger.su/katalog/bani' },
  robots: { index: false, follow: true },
}

export default function KatalogPage() {
  redirect('/katalog/bani')
}
