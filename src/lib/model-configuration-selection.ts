import type { Home, Sauna } from '@/types'
import { modelOptionAvailability } from '@/lib/model-option-availability'

/** Owner-confirmed promotional discount for baths (exit-intent offer). It is never applied silently. */
export const PROMOTIONAL_DISCOUNT_RUB = 15_000

export type ModelConfigurationCalculation = {
  modelId: string
  modelName: string
  modelType: 'sauna' | 'home'
  basePrice: number
  selectedOptionIds: string[]
  options: { id: string; name: string; price: number | null; quantity: 1 }[]
  optionsSubtotal: number
  discount: number
  discountLabel: string
  total: number
  unpricedCount: number
  currency: 'RUB'
}

type CalculationInput = { promotionalDiscount?: boolean }

export function calculateModelConfiguration(model: Sauna | Home, ids: readonly string[], input: CalculationInput = {}): ModelConfigurationCalculation {
  const unique = new Set(ids)
  const options = modelOptionAvailability(model)
    .filter(item => item.status === 'available' && unique.has(item.option.id))
    .map(({ option }) => ({ id: option.id, name: option.name, price: option.salePrice, quantity: 1 as const }))
  const optionsSubtotal = options.reduce((sum, option) => sum + (option.price ?? 0), 0)
  const isBath = 'series' in model
  const discount = input.promotionalDiscount && isBath ? Math.min(PROMOTIONAL_DISCOUNT_RUB, model.priceFrom + optionsSubtotal) : 0
  return {
    modelId: model.id,
    modelName: model.name,
    modelType: isBath ? 'sauna' : 'home',
    basePrice: model.priceFrom,
    selectedOptionIds: options.map(option => option.id),
    options,
    optionsSubtotal,
    discount,
    discountLabel: discount ? 'Скидка по акции' : '',
    total: model.priceFrom + optionsSubtotal - discount,
    unpricedCount: options.filter(option => option.price === null).length,
    currency: 'RUB',
  }
}

const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

/** Server-side comment limit for the lead contract. */
export const MANAGER_COMMENT_LIMIT = 1500

/** Compact plain-text configuration for the manager notification (fits the 1500-character comment limit). */
export function configurationManagerText(configuration: ModelConfigurationCalculation) {
  return [
    `Комплектация: ${configuration.modelName} [${configuration.modelId}]`,
    `Базовая стоимость: ${money(configuration.basePrice)}`,
    ...(configuration.options.length
      ? configuration.options.map(option => `+ ${option.name} — ${option.price === null ? 'цена по запросу' : money(option.price)}`)
      : ['Дополнительные опции не выбраны.']),
    `Стоимость дополнений: ${money(configuration.optionsSubtotal)}`,
    ...(configuration.discount ? [`${configuration.discountLabel}: −${money(configuration.discount)}`] : []),
    `Итого: ${money(configuration.total)}`,
    'Предварительный расчёт: совместимость и окончательная стоимость подтверждаются при заказе.',
  ].join('\n')
}

/**
 * The legacy lead contract has a single bounded `comment` field, so the manager message carries the
 * configuration there. The configuration summary is never truncated away; only the user comment is trimmed.
 */
export function mergeManagerComment(userComment: string, configurationText: string, limit = MANAGER_COMMENT_LIMIT) {
  const tail = configurationText.slice(0, Math.min(900, limit))
  if (!tail) return userComment.slice(0, limit)
  const room = Math.max(0, limit - tail.length - 2)
  const head = userComment.length > room ? userComment.slice(0, room).trimEnd() : userComment
  return [head, tail].filter(Boolean).join('\n\n')
}
