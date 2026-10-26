import { LegalDocument } from '@/components/privacy/LegalDocument'
export const metadata = { title: 'Политика обработки персональных данных', description: 'Единая редакция политики BANGER.SU.', alternates: { canonical: 'https://banger.su/privacy' } }
export default function PolitikaPage() { return <LegalDocument kind="policy" /> }
