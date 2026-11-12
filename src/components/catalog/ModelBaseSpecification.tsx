import { modelBaseConfiguration, requiresBaseConfigurationConfirmation } from '@/data/model-configuration'
import type { Home, Sauna } from '@/types'
import styles from './ModelBaseConfiguration.module.css'

const isIncludedGift = (value: string) => /(?:^|[\s—])в подарок(?:$|[\s.,;—])/i.test(value)
const visibleBaseValue = (value: string) => {
  const visible = value
    .replace(/\s*[—–-]\s*в подарок(?=$|[\s.,;—–-])/gi, '')
    .replace(/^\s*[;,.—–-]\s*|\s*[;,.—–-]\s*$/g, '')
    .trim()
  return /^в подарок$/i.test(visible) ? '' : visible
}

export function ModelBaseSpecification({ model }: { model: Sauna | Home }) {
  const rows = modelBaseConfiguration(model)
  const includedRows = rows.filter(row => !requiresBaseConfigurationConfirmation(row.value))

  return <div className="mb-12" data-model-config={model.id}>
    <section className={styles.baseSpecification} aria-label={`Базовая комплектация модели ${model.name}`}>
      <header className={styles.baseHeader}>
        <div>
          <p className={styles.eyebrow}>Комплектация модели {model.article ?? model.id}</p>
          <h2>Базовая комплектация</h2>
          <p className={styles.baseLead}>Всё перечисленное входит в базовую стоимость модели.</p>
        </div>
        <span className={styles.includedBadge}>Включено в стоимость</span>
      </header>
      <dl className={styles.baseTable}>
        {includedRows.map(row => {
          const gift = isIncludedGift(row.value)
          const value = visibleBaseValue(row.value)
          return <div className={styles.baseSpecRow} data-base-label={row.label} data-base-value={row.value} data-base-included="true" data-base-gift={gift ? 'true' : undefined} key={row.label}>
            <dt>{row.label}</dt>
            <dd>{value && <span>{value}</span>}{gift && <span className={styles.giftBadge}>В подарок</span>}</dd>
          </div>
        })}
      </dl>
    </section>
  </div>
}
