import { defaultOpenGraph } from '@/lib/site-metadata'
import type { Metadata } from 'next'
import { KatalogRedirect } from './redirect'

export const metadata: Metadata = {
  title: 'Каталог мобильных бань',
  description: '25 моделей мобильных бань собственного производства.',
  alternates: { canonical: 'https://banger.su/katalog/bani' },
  robots: { index: false, follow: true },

  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/katalog/bani', title: 'Каталог мобильных бань', description: '25 моделей мобильных бань собственного производства.' },
}

export default function KatalogPage() {
  return <KatalogRedirect />
}
