import { Shield } from 'lucide-react'

export function WarrantySection() {
  return <section id="home-warranty" className="site-anchor py-10" aria-labelledby="home-warranty-title">
    <div className="site-container">
      <div className="grid gap-5 md:grid-cols-[minmax(240px,.8fr)_minmax(0,1.5fr)] border-y border-gold-400/25 py-7">
        <div><Shield aria-hidden="true" className="text-gold-400 mb-3" size={26} /><h2 id="home-warranty-title" className="text-2xl font-bold text-cream">Гарантия на конструкцию — 12 месяцев</h2></div>
        <p className="text-cream/75 text-base leading-relaxed self-center">Предоставляем гарантию сроком 12 месяцев на конструктивные элементы бани. Подробные условия гарантии, порядок обращения и перечень конструктивных элементов указываются в договоре и гарантийной документации. Установленные законом права покупателя сохраняются.</p>
      </div>
    </div>
  </section>
}
