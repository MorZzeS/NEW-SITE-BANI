import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Проверка формы',
  robots: { index: false, follow: false },
}

export default function TestLeadsPage() {
  notFound()
}
