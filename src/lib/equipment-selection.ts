import { deliveryDistrictLabel, managerOptionName, isLogisticsOption, normalizeDeliveryAddress, normalizeDeliveryDistrict, resolveOptionPrice, type DeliveryDistrict } from '@/lib/logistics'
import { additionalOptions } from '@/data/options'
export const enabledEquipmentOptions = additionalOptions.filter(option => option.enabled)
export function equipmentSelection(ids: readonly string[], quantities: Readonly<Record<string, number>> = {}, logistics: { deliveryDistrict?: DeliveryDistrict; deliveryAddress?: string } = {}) {
  const deliveryDistrict = normalizeDeliveryDistrict(logistics.deliveryDistrict)
  const deliveryAddress = normalizeDeliveryAddress(logistics.deliveryAddress)
  const uniqueIds = new Set(ids)
  const selected = enabledEquipmentOptions.filter(option => uniqueIds.has(option.id) && !(option.id === 'ceiling-height' && quantities[option.id] === 0)).map(option => ({ ...option, salePrice: resolveOptionPrice(option, deliveryDistrict), kind: isLogisticsOption(option.id) ? 'logistics' as const : 'equipment' as const, quantity: option.id === 'ceiling-height' ? Math.max(1, Math.min(2, Math.floor(Number.isFinite(quantities[option.id]) ? quantities[option.id] : 1))) : 1 }))
  const subtotal = (kind?: string) => selected.filter(option => !kind || option.kind === kind).reduce((sum, option) => sum + (option.salePrice ?? 0) * option.quantity, 0)
  const knownTotal = subtotal(), equipmentSubtotal = subtotal('equipment'), logisticsSubtotal = subtotal('logistics')
  const unpricedCount = selected.filter(option => option.salePrice === null).length
  const money = (price: number) => price.toLocaleString('ru-RU') + ' ₽'
  const summary = (compact = false) => selected.length || deliveryAddress || deliveryDistrict !== 'unknown' ? [
    selected.length ? (compact ? 'Опции:' : 'Выбранные дополнительные опции:') : 'Дополнительные опции не выбраны.',
    ...selected.map(option => (compact ? '' : '• ') + managerOptionName(option, compact) + (option.id === 'ceiling-height' ? ' (+' + option.quantity * 10 + ' см)' : '') + ' — ' + (option.salePrice === null ? 'Индивидуальный расчёт' : money(option.salePrice * option.quantity))),
    (compact ? 'Оборудование ' : 'Оборудование: ') + money(equipmentSubtotal),
    (compact ? 'Логистика ' : 'Логистика: ') + money(logisticsSubtotal),
    (compact ? 'Дополнения: ' : 'Итого дополнений: ') + money(knownTotal),
    ...(selected.some(option => option.kind === 'logistics') || deliveryAddress || deliveryDistrict !== 'unknown' ? ['Район: ' + deliveryDistrictLabel(deliveryDistrict), ...(deliveryAddress ? ['Адрес: ' + deliveryAddress] : [])] : []),
    ...(unpricedCount ? ['Предварительная сумма без позиций индивидуального расчёта и неподтверждённой логистики.'] : []),
  ].join('\n') : ''
  const comment = summary().length > 1500 ? summary(true) : summary()
  return { selected, knownTotal, equipmentSubtotal, logisticsSubtotal, unpricedCount, comment, deliveryDistrict, deliveryAddress }
}
export function mergeConfigurationComment(comment: string, configurationNote?: string) {
  const result = configurationNote ? [configurationNote, comment].filter(Boolean).join('\n\n') : comment
  if (result.length > 1500) throw new Error('Сократите комментарий: вместе с выбранными опциями он должен быть не длиннее 1500 символов.')
  return result
}
export function optionCountLabel(count: number) {
  const word = count % 10 === 1 && count % 100 !== 11 ? 'опция' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'опции' : 'опций'
  return `${count} ${word}`
}
