import type { Home, Sauna } from '@/types'
import { modelOptionAvailability } from '@/lib/model-option-availability'
export type ModelConfigurationCalculation = {
  modelId: string
  modelName: string
  modelType: 'sauna' | 'home'
  basePrice: number
  selectedOptionIds: string[]
  options: { id: string; name: string; price: number | null; quantity: 1 }[]
  optionsSubtotal: number
  total: number
  unpricedCount: number
  currency: 'RUB'
}
export function calculateModelConfiguration(model: Sauna | Home, ids: readonly string[]): ModelConfigurationCalculation {
  const unique = new Set(ids)
  const options = modelOptionAvailability(model)
    .filter(item => item.status === 'available' && unique.has(item.option.id))
    .map(({ option }) => ({ id: option.id, name: option.name, price: option.salePrice, quantity: 1 as const }))
  const optionsSubtotal = options.reduce((sum, option) => sum + (option.price ?? 0), 0)
  return { modelId: model.id, modelName: model.name, modelType: 'series' in model ? 'sauna' : 'home',
    basePrice: model.priceFrom, selectedOptionIds: options.map(option => option.id), options,
    optionsSubtotal, total: model.priceFrom + optionsSubtotal,
    unpricedCount: options.filter(option => option.price === null).length, currency: 'RUB' }
}
