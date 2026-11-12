import { defaultOpenGraph } from '@/lib/site-metadata'
import { LegalDocument } from '@/components/privacy/LegalDocument'
export const metadata = { title: 'Политика обработки персональных данных', description: 'Единая редакция политики BANGER.SU.', alternates: { canonical: 'https://banger.su/privacy' } ,
  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/privacy', title: 'Политика обработки персональных данных', description: 'Единая редакция политики BANGER.SU.' },
}
export default function PolitikaPage() { return <LegalDocument kind="policy" /> }
