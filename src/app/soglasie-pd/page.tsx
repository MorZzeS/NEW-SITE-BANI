import { defaultOpenGraph } from '@/lib/site-metadata'
import { LegalDocument } from '@/components/privacy/LegalDocument'
export const metadata = { title: 'Отдельные согласия на обработку данных', description: 'Самостоятельные цели согласия, запрос прогноза и порядок отзыва. Страница не принимает онлайн-заявки.', alternates: { canonical: 'https://banger.su/soglasie-pd' } ,
  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/soglasie-pd', title: 'Отдельные согласия на обработку данных', description: 'Самостоятельные цели согласия, запрос прогноза и порядок отзыва. Страница не принимает онлайн-заявки.' },
}
export default function SoglasiePdPage() { return <LegalDocument kind="consent" /> }