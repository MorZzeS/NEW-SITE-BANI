import { Shield } from 'lucide-react'
import Link from 'next/link'

export function WarrantySection() {
  return <section id="home-warranty" className="site-anchor py-10" aria-labelledby="home-warranty-title">
    <div className="site-container">
      <div className="grid gap-5 md:grid-cols-[minmax(240px,.8fr)_minmax(0,1.5fr)] border-y border-gold-400/25 py-7">
        <div><Shield aria-hidden="true" className="text-gold-400 mb-3" size={26} /><h2 id="home-warranty-title" className="text-2xl font-bold text-cream">Гарантия и поддержка после покупки</h2></div>
        <div className="space-y-3 max-w-[68ch] text-cream/75 text-base leading-relaxed">
          <p className="text-xl font-semibold text-cream">12 месяцев гарантии на конструктивные элементы бани.</p>
          <p>Мы отвечаем за качество изготовления и остаёмся на связи после установки. Если возникнут вопросы по конструкции, свяжитесь с нами — изучим ситуацию, проверим информацию по заказу и поможем определить дальнейшие действия.</p>
          <p>Условия гарантии указаны в договоре и гарантийных документах. Ваши законные права сохраняются.</p>
          <Link href="/kontakty" className="inline-flex min-h-11 items-center text-gold-400 underline underline-offset-4">Связаться с нами →</Link>
        </div>
      </div>
    </div>
  </section>
}
