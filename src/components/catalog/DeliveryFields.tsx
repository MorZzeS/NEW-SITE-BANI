'use client'
import type { DeliveryDistrict } from '@/lib/logistics'
import styles from './DeliveryFields.module.css'

/** Shared manual choice for both configurators. The address never silently changes the district. */
export function DeliveryFields({ id, district, address, onDistrict, onAddress }: {
  id: string; district: DeliveryDistrict; address: string; onDistrict: (value: DeliveryDistrict) => void; onAddress: (value: string) => void
}) {
  return <section className={styles.deliveryFields} aria-labelledby={`${id}-delivery-heading`} data-delivery-fields>
    <h3 className={styles.heading} id={`${id}-delivery-heading`}>Район доставки и разгрузки</h3>
    <div className={styles.fields}>
    <div className={styles.field}>
    <label className={styles.label} htmlFor={`${id}-district`}>Выберите район вручную</label>
    <select id={`${id}-district`} className="lead-input w-full min-w-0" value={district} onChange={event => onDistrict(event.target.value as DeliveryDistrict)}>
      <option value="unknown">Район не указан</option>
      <option value="ramenskoe">Раменский район</option>
      <option value="outside">За пределами Раменского района</option>
    </select>
    </div>
    <div className={styles.field}>
    <label className={styles.label} htmlFor={`${id}-address`}>Адрес доставки (необязательно)</label>
    <input id={`${id}-address`} className="lead-input w-full min-w-0" autoComplete="street-address" maxLength={300} value={address} onChange={event => onAddress(event.target.value)} />
    </div>
    <p className={styles.note}>Доставка и разгрузка выбираются отдельно. {district === 'ramenskoe' ? 'Для выбранного района: доставка 20 000 ₽, разгрузка краном 25 000 ₽.' : 'Без указанного Раменского района — индивидуальный расчёт; стоимость услуг в сумму не включена.'} Адрес и условия работ подтвердит менеджер.</p>
    </div>
  </section>
}
