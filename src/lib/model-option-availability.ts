import type { Home, Sauna } from '@/types'
import { modelBaseConfiguration } from '@/data/model-configuration'
import { enabledEquipmentOptions } from '@/lib/equipment-selection'

export type ModelOptionStatus = 'available' | 'included' | 'unavailable' | 'unknown'
export type ModelOptionEvidence = { status: ModelOptionStatus; reason: string; source: string }
// Prices are not compatibility evidence. Add only confirmed model-specific records.
export const confirmedModelOptionMatrix: Readonly<Record<string, Readonly<Record<string, ModelOptionEvidence>>>> = {}
export function modelOptionAvailability(model: Sauna | Home) {
  const rows = modelBaseConfiguration(model)
  const value = (label: string) => rows.find(row => row.label === label)?.value ?? ''
  return enabledEquipmentOptions.map(option => {
    let evidence: ModelOptionEvidence = confirmedModelOptionMatrix[model.id]?.[option.id] ?? {
      status: 'unknown', reason: 'Требует согласования: совместимость с этой моделью не подтверждена.', source: 'Нет подтверждённых данных',
    }
    const included = option.id === 'boiler' && /бойлер\s*50\s*л/i.test(value('Оборудование'))
      || option.id === 'furniture' && /стол и две лавки/i.test(value('Комната отдыха'))
    if (included) evidence = { status: 'included', reason: 'Уже включено в базовую комплектацию.', source: 'src/data/model-configuration.ts' }
    if (option.id === 'wc' && /санузел/i.test(value('Помещения'))) evidence = {
      status: 'unknown', reason: 'Санузел предусмотрен планировкой. Состав сантехники и проводки воды требует согласования.', source: 'src/data/model-configuration.ts',
    }
    if (option.id === 'ermak' && /печь/i.test(value('Печное решение'))) evidence = {
      status: 'unknown', reason: 'Печь уже предусмотрена. Совместимость и стоимость замены на Ермак 12 ПС требуют согласования.', source: 'src/data/model-configuration.ts',
    }
    return { option, ...evidence, blockedReason: evidence.status === 'available' ? undefined : evidence.reason }
  })
}
