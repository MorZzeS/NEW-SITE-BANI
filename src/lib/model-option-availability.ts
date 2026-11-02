import type { Home, Sauna } from '@/types'
import { modelBaseConfiguration } from '@/data/model-configuration'
import { enabledEquipmentOptions } from '@/lib/equipment-selection'

export function modelOptionAvailability(model: Sauna | Home) {
  const baseRows = modelBaseConfiguration(model)
  const rooms = baseRows.find(row => row.label === 'Помещения')?.value ?? ''
  const equipment = baseRows.find(row => row.label === 'Оборудование')?.value ?? ''
  const lounge = baseRows.find(row => row.label === 'Комната отдыха')?.value ?? ''
  const stove = baseRows.find(row => row.label === 'Печное решение')?.value ?? ''

  return enabledEquipmentOptions.map(option => {
    let blockedReason: string | undefined
    if (option.id === 'boiler' && /бойлер\s*50\s*л/i.test(equipment)) {
      blockedReason = 'Бойлер 50 л уже указан в базовой комплектации этой модели.'
    } else if (option.id === 'furniture' && /стол и две лавки/i.test(lounge)) {
      blockedReason = 'Стол и две лавки уже указаны в базовой комплектации этой модели.'
    } else if (option.id === 'wc' && /санузел/i.test(rooms)) {
      blockedReason = 'Санузел уже предусмотрен базовой комплектацией этой модели.'
    } else if (option.id === 'ermak' && /печь/i.test(stove)) {
      blockedReason = 'Печь уже входит в базовую комплектацию. Цена замены на Ермак 12 ПС не подтверждена, поэтому повторная стоимость в калькулятор не добавляется.'
    }
    return { option, blockedReason }
  })
}
