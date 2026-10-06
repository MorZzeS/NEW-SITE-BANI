import { modelBaseConfiguration } from '@/data/model-configuration'
import type { Sauna, Home } from '@/types'
export function ModelBaseConfiguration({ model }: { model: Sauna | Home }) {
  return <section className="model-base-configuration mb-16" data-model-config={model.id} aria-label="Базовая комплектация">
    <h2 className="text-2xl font-bold text-cream mb-3">Базовая комплектация</h2>
    <p className="text-sm text-cream/60 mb-5">Для {model.article}. Дополнительные опции рассчитываются отдельно. Неподтверждённые параметры согласуются при заказе.</p>
    <dl>{modelBaseConfiguration(model).map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
  </section>
}
