import { defaultOpenGraph } from '@/lib/site-metadata'
import { LegalDocument } from '@/components/privacy/LegalDocument'
export const metadata = { title: 'Политика обработки персональных данных', description: 'Оператор, цели обработки, внешние сервисы, права субъектов и порядок обращения по вопросам данных BANGER.SU.', alternates: { canonical: 'https://banger.su/privacy' } ,
  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/privacy', title: 'Политика обработки персональных данных', description: 'Оператор, цели обработки, внешние сервисы, права субъектов и порядок обращения по вопросам данных BANGER.SU.' },
}
export default function PrivacyPage() { return <LegalDocument kind="policy" /> }
