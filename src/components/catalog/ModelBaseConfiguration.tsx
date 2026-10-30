import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { modelBaseConfiguration } from '@/data/model-configuration'
import type { Sauna, Home } from '@/types'
import styles from './ModelBaseConfiguration.module.css'

export function ModelBaseConfiguration({ model }: { model: Sauna | Home }) {
  return <section className={`${styles.configuration} mb-16`} data-model-config={model.id} aria-label="Базовая комплектация">
    <h2 className="text-2xl font-bold text-cream mb-3">Базовая комплектация</h2>
    <p className="text-sm text-cream/60 mb-5">Для {model.article}. Дополнительные опции рассчитываются отдельно. Неподтверждённые параметры согласуются при заказе.</p>
    <dl className={styles.rows}>{modelBaseConfiguration(model).map(row => <div className={styles.row} key={row.label}>
      <dt><span className={styles.tick} aria-hidden="true"><Check size={15} strokeWidth={2.5} /></span>{row.label}</dt>
      <dd>{row.value}</dd>
    </div>)}</dl>
    <div className="glass rounded-2xl p-5 mt-6">
      <h3 className="font-semibold text-cream mb-2">Дополнительные опции</h3>
      <p className="text-sm text-cream/60 mb-4">Подберите дополнения к базовой комплектации. Их стоимость рассчитывается отдельно.</p>
      <Link href="/komplektaciya" className="btn-secondary inline-flex items-center gap-2">Смотреть дополнительные опции <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  </section>
}
