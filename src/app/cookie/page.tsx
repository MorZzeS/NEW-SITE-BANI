import { defaultOpenGraph } from '@/lib/site-metadata'
import { LegalDocument } from '@/components/privacy/LegalDocument'
export const metadata = { title: 'Cookie и локальное хранение', description: 'Фактические настройки браузера BANGER.SU, внешние функции и управление локальными записями.', alternates: { canonical: 'https://banger.su/cookie' } ,
  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/cookie', title: 'Cookie и локальное хранение', description: 'Фактические настройки браузера BANGER.SU, внешние функции и управление локальными записями.' },
}
export default function CookiePage() { return <LegalDocument kind="cookie" /> }