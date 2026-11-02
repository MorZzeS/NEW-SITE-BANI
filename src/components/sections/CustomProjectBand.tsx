'use client'

import { CUSTOM_PROJECT_TOPIC, LEAD_TOPIC_EVENT } from '@/lib/lead-topics'

/**
 * Full-width offer under the catalogue directions. It is not a product card and does not
 * assign a ready model or a price: the button passes only the project topic to the existing
 * "Свяжитесь с нами" form and scrolls to it.
 */
export function CustomProjectBand() {
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

    <div className="relative z-10 grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)] lg:items-center lg:gap-14 lg:p-12">
      <div className="max-w-2xl">
        <div className="section-tag mb-4">Индивидуальные решения</div>
        <h3 id="custom-project-title" className="text-2xl font-bold leading-tight tracking-tight text-cream sm:text-3xl lg:text-[34px]">Баня по вашему проекту</h3>
        <p className="mt-4 text-sm leading-relaxed text-cream/70 sm:text-base">Не нашли подходящий вариант среди готовых моделей?</p>
        <p className="mt-2 text-sm leading-relaxed text-cream/70 sm:text-base">Мы предлагаем изготовление мобильных бань по индивидуальному заказу. Разработаем планировку с учётом ваших пожеланий, подберём комплектацию и дополнительные опции.</p>
        <p className="mt-4 text-sm font-semibold leading-relaxed text-cream sm:text-base">Каждый проект рассчитывается индивидуально — с учётом размеров, планировки и выбранного оснащения.</p>
      </div>

      <div className="flex flex-col items-stretch gap-3 lg:items-end">
        <button type="button" onClick={discussProject} className="btn-primary min-h-12 w-full justify-center px-7 text-base lg:w-auto" data-custom-project-cta>
          Обсудить свой проект <span aria-hidden="true">→</span>
        </button>
        <p className="text-xs leading-relaxed text-cream/60 lg:text-right">Планировка, комплектация и стоимость — после обсуждения проекта.</p>
      </div>
    </div>
  </aside>
}
