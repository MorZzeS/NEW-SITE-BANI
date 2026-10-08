import { additionalOptions } from '@/data/options'
export const enabledEquipmentOptions = additionalOptions.filter(option => option.enabled)
export function equipmentSelection(ids: readonly string[]) {
  const selected = enabledEquipmentOptions.filter(option => ids.includes(option.id))
  return { selected, knownTotal: selected.reduce((sum, option) => sum + (option.salePrice ?? 0), 0), unpricedCount: selected.filter(option => option.salePrice === null).length,
    comment: selected.length ? ['Выбранные дополнительные опции:', ...selected.map(option => `• ${option.name}${option.priceUnit === 'шт.' ? ' — 1 шт.' : ''}`)].join('\n') : '' }
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
