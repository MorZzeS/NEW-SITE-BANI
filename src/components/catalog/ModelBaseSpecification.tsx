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
  const pendingRows = rows.filter(row => requiresBaseConfigurationConfirmation(row.value))

  return <div className="mb-12" data-model-config={model.id}>
    <section className={styles.baseSpecification} aria-label={`Базовая комплектация модели ${model.name}`}>
      <header className={styles.baseHeader}>
        <div>
          <p className={styles.eyebrow}>Комплектация модели {model.article ?? model.id}</p>
          <h2>Базовая комплектация</h2>
          <p className={styles.baseLead}>{pendingRows.length ? 'В таблице перечислены подтверждённые позиции. Остальные параметры указаны отдельно ниже.' : 'Всё перечисленное входит в базовую стоимость модели.'}</p>
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
    {pendingRows.length > 0 && <details className={styles.pendingDetails} aria-label="Параметры для согласования">
      <summary className={styles.pendingSummary}>
        <span>Параметры для согласования</span>
        <span className={styles.pendingCount}>{pendingRows.length} {pendingRows.length === 1 ? 'позиция' : 'позиций'}</span>
      </summary>
      <p className={styles.pendingIntro}>Эти характеристики уточняются с менеджером и не входят в подтверждённую спецификацию.</p>
      <dl className={`${styles.baseTable} ${styles.pendingTable}`}>{pendingRows.map(row => <div className={styles.baseSpecRow} data-base-label={row.label} data-base-value={row.value} data-base-included="false" key={row.label}>
        <dt>{row.label}</dt>
        <dd><span>{row.value}</span><span className={styles.pendingBadge}>Уточнить</span></dd>
      </div>)}</dl>
    </details>}
  </div>
}
