'use client'
import type { DeliveryDistrict } from '@/lib/logistics'

/** Shared manual choice for both configurators. The address never silently changes the district. */
export function DeliveryFields({ id, district, address, onDistrict, onAddress }: {
  id: string; district: DeliveryDistrict; address: string; onDistrict: (value: DeliveryDistrict) => void; onAddress: (value: string) => void
}) {
  return <fieldset className="glass rounded-xl p-4 mb-4 min-w-0" data-delivery-fields>
    <legend className="px-2 text-sm font-semibold text-cream">Район доставки и разгрузки</legend>
    <label className="block text-sm text-cream" htmlFor={`${id}-district`}>Выберите район вручную</label>
    <select id={`${id}-district`} className="lead-input w-full min-w-0 mt-2" value={district} onChange={event => onDistrict(event.target.value as DeliveryDistrict)}>
      <option value="unknown">Район не указан</option>
      <option value="ramenskoe">Раменский район</option>
      <option value="outside">За пределами Раменского района</option>
    </select>
    <label className="block text-sm text-cream mt-3" htmlFor={`${id}-address`}>Адрес доставки (необязательно)</label>
    <input id={`${id}-address`} className="lead-input w-full min-w-0 mt-2" autoComplete="street-address" maxLength={300} value={address} onChange={event => onAddress(event.target.value)} />
    <p className="text-xs text-cream/70 mt-3">Доставка и разгрузка выбираются отдельно. {district === 'ramenskoe' ? 'Для выбранного района: доставка 20 000 ₽, разгрузка краном 25 000 ₽.' : 'Без указанного Раменского района — индивидуальный расчёт; стоимость услуг в сумму не включена.'} Адрес и условия работ подтвердит менеджер.</p>
  </fieldset>
}
