import { deliveryDistrictLabel, managerOptionName, isLogisticsOption, normalizeDeliveryAddress, normalizeDeliveryDistrict, resolveOptionPrice, type DeliveryDistrict } from '@/lib/logistics'
import { additionalOptions } from '@/data/options'
export const enabledEquipmentOptions = additionalOptions.filter(option => option.enabled)
export const stoveOptionIds = ['ermak-base', 'ermak', 'ermak-16-ps', 'ermak-16-premium-steel', 'ermak-16-premium-cast-iron'] as const
export function optionSelectionGroup(id: string): 'stove' | undefined {
  return (stoveOptionIds as readonly string[]).includes(id) ? 'stove' : undefined
}
export function optionQuantityLimit(option: { id: string; priceUnit?: string }): number {
  return option.id === 'ceiling-height' ? 2 : option.priceUnit === 'шт.' ? 99 : 1
}
/** Zero removes a selected quantity option; malformed values safely fall back to one. */
export function normalizeOptionQuantity(option: { id: string; priceUnit?: string }, value: unknown): number {
  if (value === 0) return 0
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(1, Math.min(optionQuantityLimit(option), Math.floor(value))) : 1
}
export function optionQuantityLabel(option: { id: string; quantity: number }, compact = false): string {
  return option.id === 'ceiling-height' ? ` (+${option.quantity * 10} см)` : option.quantity > 1 ? compact ? ` ×${option.quantity}` : ` (${option.quantity} шт.)` : ''
}
const selectionConflicts: Readonly<Record<string, readonly string[]>> = {
  'external-light': ['outdoor-lighting', 'hidden-wiring'],
  'outdoor-lighting': ['external-light'], 'hidden-wiring': ['external-light'],
}
/** Last explicit selection wins, including restored/stale input and direct calculator calls. */
export function normalizeOptionIds(ids: readonly string[]): string[] {
  return ids.reduce<string[]>((selected, id) => {
    if (!enabledEquipmentOptions.some(option => option.id === id)) return selected
    const group = optionSelectionGroup(id)
    return [...selected.filter(other => other !== id && !(group && optionSelectionGroup(other) === group) && !selectionConflicts[id]?.includes(other)), id]
  }, [])
}
export function toggleEquipmentOption(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? normalizeOptionIds(ids.filter(value => value !== id)) : normalizeOptionIds([...ids, id])
}
export function equipmentSelection(ids: readonly string[], quantities: Readonly<Record<string, number>> = {}, logistics: { deliveryDistrict?: DeliveryDistrict; deliveryAddress?: string } = {}) {
  const deliveryDistrict = normalizeDeliveryDistrict(logistics.deliveryDistrict)
  const deliveryAddress = normalizeDeliveryAddress(logistics.deliveryAddress)
  const uniqueIds = new Set(normalizeOptionIds(ids))
  const selected = enabledEquipmentOptions.filter(option => uniqueIds.has(option.id) && normalizeOptionQuantity(option, quantities[option.id]) > 0).map(option => ({ ...option, salePrice: resolveOptionPrice(option, deliveryDistrict), kind: isLogisticsOption(option.id) ? 'logistics' as const : 'equipment' as const, quantity: normalizeOptionQuantity(option, quantities[option.id]) }))
  const subtotal = (kind?: string) => selected.filter(option => !kind || option.kind === kind).reduce((sum, option) => sum + (option.salePrice ?? 0) * option.quantity, 0)
  const knownTotal = subtotal(), equipmentSubtotal = subtotal('equipment'), logisticsSubtotal = subtotal('logistics')
  const unpricedCount = selected.filter(option => option.salePrice === null).length
  const money = (price: number) => price.toLocaleString('ru-RU') + ' ₽'
  const summary = (compact = false) => selected.length || deliveryAddress || deliveryDistrict !== 'unknown' ? [
    selected.length ? (compact ? 'Опции:' : 'Выбранные дополнительные опции:') : 'Дополнительные опции не выбраны.',
    ...selected.map(option => (compact ? '' : '• ') + managerOptionName(option, compact) + optionQuantityLabel(option, compact) + ' — ' + (option.salePrice === null ? (compact ? 'согл.' : 'Стоимость по согласованию') : money(option.salePrice * option.quantity))),
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
