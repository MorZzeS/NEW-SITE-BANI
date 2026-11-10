'use client'
import type { Sauna } from '@/types'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import { useModelConfiguration } from './ModelConfigurationContext'

export function PremiumConfigurationInfo({ model }: { model: Sauna }) {
  const { configuration } = useModelConfiguration()
  return <section className="mb-16" data-premium-configuration={model.id}>
    <div className="glass rounded-2xl p-6 sm:p-8 mb-6 border border-gold-400/25">
      <p className="section-tag mb-3">Индивидуальный подход</p>
      <h2 className="text-2xl font-bold text-cream mb-4">Премиальная комплектация</h2>
      <p className="text-cream/75 leading-relaxed max-w-3xl">В стоимость бани «Барн Премиум» уже включён расширенный набор дополнительных опций и оборудования. Дополнительные изменения и индивидуальные пожелания обсуждаются отдельно. Стоимость рассчитывается персонально.</p>
      <a href={`#model-contacts-${model.id}`} className="btn-primary inline-flex mt-6">Оставить заявку</a>
    </div>
    <div id={`model-contacts-${model.id}`} className="site-anchor"><CTAFormInline modelName={model.name} configurationDetails={configuration} /></div>
  </section>
}
