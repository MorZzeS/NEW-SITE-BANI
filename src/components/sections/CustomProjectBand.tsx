'use client'

import Image from 'next/image'
import Link from 'next/link'
import { saunas } from '@/data'
import { projects } from '@/data/projects'
import { withBasePath } from '@/lib/site-path'
import { CUSTOM_PROJECT_TOPIC, LEAD_TOPIC_EVENT } from '@/lib/lead-topics'

/**
 * Full-width offer under the catalogue directions. It is not a product card and does not
 * assign a ready model or a price: the button passes only the project topic to the existing
 * "Свяжитесь с нами" form and scrolls to it.
 */
export function CustomProjectBand() {
  const barn = saunas.find(model => model.id === 'bg-28')!
  const premium = projects.find(project => project.id === 'project-premium-6x26')!
  const offers = [
    { title: 'Барн Премиум', image: barn.image, href: '/banya/' + barn.slug, price: barn.priceFrom, note: 'Представленное исполнение' },
    { title: 'Скандинавия 6 × 2,6 м', image: premium.cover.thumbnail, href: '/nashi-raboty/' + premium.slug, price: 1100000, note: 'С доставкой и установкой под ключ' },
  ]
  function discussProject() {
    window.dispatchEvent(new CustomEvent(LEAD_TOPIC_EVENT, { detail: CUSTOM_PROJECT_TOPIC }))
    const target = document.querySelector<HTMLElement>('[data-home-lead-form]')
    if (!target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    const focusTarget = () => {
      const field = target.querySelector<HTMLElement>('input[autocomplete="name"], input[type="tel"]')
      ;(field ?? target).focus({ preventScroll: true })
    }
    if (reduced) focusTarget()
    else window.setTimeout(focusTarget, 700)
  }

  return <aside className="theme-cta relative mt-8 overflow-hidden rounded-4xl md:mt-10" aria-labelledby="custom-project-title" data-custom-project>
    <div className="absolute inset-0 bg-gradient-to-br from-wood-900/60 via-graphite-900/80 to-graphite-950/90" aria-hidden="true" />
    <div className="absolute inset-0" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(ellipse at 88% 12%, rgba(196,118,46,0.22) 0%, transparent 55%), radial-gradient(ellipse at 10% 92%, rgba(212,168,67,0.10) 0%, transparent 60%)' }} />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" aria-hidden="true" />
    <div className="absolute inset-0 rounded-4xl border border-white/10" aria-hidden="true" />

    <div className="relative z-10 grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-8 lg:p-8">
      <div className="max-w-2xl">
        <div className="section-tag mb-4">Индивидуальные решения</div>
        <h3 id="custom-project-title" className="text-2xl font-bold leading-tight tracking-tight text-cream sm:text-3xl lg:text-[34px]">Баня по вашему проекту</h3>
        <p className="mt-4 text-sm leading-relaxed text-cream/70 sm:text-base">Не нашли подходящий вариант среди готовых моделей?</p>
        <p className="mt-2 text-sm leading-relaxed text-cream/70 sm:text-base">Мы предлагаем изготовление мобильных бань по индивидуальному заказу. Разработаем планировку с учётом ваших пожеланий, подберём комплектацию и дополнительные опции.</p>
        <p className="mt-4 text-sm font-semibold leading-relaxed text-cream sm:text-base">Каждый проект рассчитывается индивидуально — с учётом размеров, планировки и выбранного оснащения.</p>
      </div>

      <div className="flex min-w-0 flex-col items-stretch gap-4">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3" data-custom-project-offers>
          {offers.map(offer => <Link key={offer.href} href={offer.href} className="flex min-w-0 min-[480px]:flex-col overflow-hidden rounded-2xl border border-white/15 bg-black/15 focus-visible:outline-2 focus-visible:outline-gold-400">
            <span className="relative block w-1/3 shrink-0 min-[480px]:w-full min-[480px]:aspect-[3/2] overflow-hidden"><Image src={withBasePath(offer.image)} alt={offer.title} fill sizes="(min-width: 1024px) 280px, 45vw" className="object-cover" /></span>
            <span className="flex flex-1 flex-col gap-2 p-3"><strong className="text-sm leading-snug text-cream">{offer.title}</strong><span className="mt-auto text-base font-bold text-gold-400">{offer.price.toLocaleString('ru-RU')} ₽</span><span className="text-xs leading-relaxed text-cream/70">{offer.note}</span></span>
          </Link>)}
        </div>
        <button type="button" onClick={discussProject} className="btn-primary min-h-12 w-full justify-center px-7 text-base" data-custom-project-cta>
          Обсудить свой проект <span aria-hidden="true">→</span>
        </button>
        <p className="text-xs leading-relaxed text-cream/60">Планировка, комплектация и стоимость — после обсуждения проекта.</p>
      </div>
    </div>
  </aside>
}
