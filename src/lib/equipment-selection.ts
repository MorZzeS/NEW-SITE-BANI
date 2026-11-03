import { additionalOptions } from '@/data/options'
export const enabledEquipmentOptions = additionalOptions.filter(option => option.enabled)
export function equipmentSelection(ids: readonly string[], quantities: Readonly<Record<string, number>> = {}) {
  const uniqueIds = new Set(ids)
  const selected = enabledEquipmentOptions.filter(option => uniqueIds.has(option.id)).map(option => ({ ...option, quantity: option.id === 'ceiling-height' ? Math.max(1, Math.min(20, Math.floor(quantities[option.id] || 1))) : 1 }))
  return { selected, knownTotal: selected.reduce((sum, option) => sum + (option.salePrice ?? 0) * option.quantity, 0), unpricedCount: selected.filter(option => option.salePrice === null).length,
    comment: selected.length ? ['Выбранные дополнительные опции:', ...selected.map(option => `• ${option.name}${option.id === 'ceiling-height' ? ` — +${option.quantity * 10} см (${option.quantity} × 10 см)` : option.priceUnit === 'шт.' ? ' — 1 шт.' : ''}`)].join('\n') : '' }
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
