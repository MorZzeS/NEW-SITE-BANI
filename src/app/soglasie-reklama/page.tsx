import Link from 'next/link'
export const metadata = { title: 'Рекламные сообщения', description: 'В текущей версии BANGER.SU подписка на рекламные сообщения не оформляется.', alternates: { canonical: 'https://banger.su/soglasie-reklama' } }
export default function SoglasieReklamaPage() {
  return <div className="pt-28 pb-20 site-container"><h1 className="text-4xl font-bold text-cream mb-6">Рекламные сообщения</h1><div className="glass rounded-3xl p-8 text-cream/70 space-y-4 text-sm"><p>В текущей версии сайта подписка на рекламные сообщения не оформляется. Согласие на рекламу через эту страницу не запрашивается.</p><Link href="/privacy" className="inline-block underline">Информация о работе сайта</Link></div></div>
}
