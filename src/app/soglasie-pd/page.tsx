import Link from 'next/link'
export const metadata = { title: 'Обращение через контакты', description: 'В текущей версии сайта формы отправки обращений отсутствуют.', alternates: { canonical: 'https://banger.su/soglasie-pd' } }
export default function SoglasiePdPage() {
  return <div className="pt-28 pb-20 site-container"><h1 className="text-4xl font-bold text-cream mb-6">Обращение через контакты</h1><div className="glass rounded-3xl p-8 text-cream/70 space-y-4 text-sm"><p>В текущей версии сайта формы отправки обращений отсутствуют. Согласие через эту страницу не запрашивается.</p><Link href="/privacy" className="inline-block underline">Информация о работе сайта</Link><br /><Link href="/kontakty" className="inline-block underline">Связаться с нами</Link></div></div>
}
