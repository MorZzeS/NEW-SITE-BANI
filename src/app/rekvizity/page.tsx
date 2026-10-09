import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Реквизиты — Бани Герасимов', description: 'Юридические данные продавца и оператора персональных данных.', alternates: { canonical: 'https://banger.su/rekvizity' }, }
import { PhoneLinks } from '@/components/ui/PhoneLinks'

export default function RekvizityPage() {
  return (
    <div className="pt-28 pb-20 site-container">
      <h1 className="text-4xl font-extrabold text-cream mb-6">Реквизиты</h1>
      <div className="glass rounded-3xl p-8 text-cream/90 space-y-3 text-sm leading-relaxed">
        <p><strong>Продавец / Оператор персональных данных:</strong></p>
        <p>Индивидуальный предприниматель Лещенко Максим Витальевич</p>
        <p><strong>ИНН:</strong> 504810391201</p>
        <p><strong>ОГРНИП:</strong> 319507400024020</p>
        <div><strong>Телефоны:</strong><PhoneLinks className="text-gold-400" /></div>
        <p><strong>Email:</strong> <a href="mailto:info@banger.su" className="text-gold-300 hover:underline">info@banger.su</a></p>
        <p className="text-cream/40 pt-2 text-xs">Банковские реквизиты доступны по запросу для заключения договоров и выставления счетов.</p>
      </div>
    </div>
  )
}
