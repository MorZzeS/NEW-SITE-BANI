'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Home, Sauna } from '@/types'
import { calculateModelConfiguration, type ModelConfigurationCalculation } from '@/lib/model-configuration-selection'
import { modelOptionAvailability } from '@/lib/model-option-availability'

type ConfigurationContext = {
  configuration: ModelConfigurationCalculation
  selectedIds: string[]
  promotionalDiscount: boolean
  toggleOption: (id: string) => void
  setOptionQuantity: (id: string, quantity: number) => void
  resetSelection: () => void
}
const Context = createContext<ConfigurationContext | null>(null)

/** URL-driven state only: the owner-approved 15 000 ₽ offer is shown only for baths opened from the promo. */
function promotionFromLocation() {
  if (typeof window === 'undefined') return false
  try { return new URLSearchParams(window.location.search).get('source') === 'exit-intent' } catch { return false }
}

export function ModelConfigurationProvider({ model, children }: { model: Sauna | Home; children: ReactNode }) {
  const [selection, setSelection] = useState<{ modelId: string; ids: string[]; quantities: Record<string, number> }>({ modelId: model.id, ids: [], quantities: {} })
  const [promotionalDiscount, setPromotionalDiscount] = useState(false)
  const allowed = new Set(modelOptionAvailability(model).filter(row => row.status === 'available').map(row => row.option.id))
  useEffect(() => { setPromotionalDiscount(promotionFromLocation()) }, [model.id])
  const configuration = calculateModelConfiguration(model, selection.modelId === model.id ? selection.ids : [], { promotionalDiscount, quantities: selection.modelId === model.id ? selection.quantities : {} })
  function toggleOption(id: string) {
    if (!allowed.has(id)) return
    setSelection(current => {
      const ids = current.modelId === model.id ? current.ids : []
      const adding = !ids.includes(id)
      const withoutDuplicateLighting = adding && id === 'outdoor-lighting' ? ids.filter(item => item !== 'external-light')
        : adding && id === 'external-light' ? ids.filter(item => item !== 'outdoor-lighting') : ids
      const nextIds = adding ? [...withoutDuplicateLighting, id] : withoutDuplicateLighting.filter(item => item !== id)
      const next = calculateModelConfiguration(model, nextIds, { promotionalDiscount, quantities: current.quantities })
      return { modelId: model.id, ids: next.selectedOptionIds, quantities: current.quantities }
    })
  }
  function setOptionQuantity(id: string, quantity: number) {
    if (!allowed.has(id) || id !== 'ceiling-height') return
    const steps = Number.isFinite(quantity) ? Math.max(1, Math.min(20, Math.floor(quantity))) : 1
    setSelection(current => ({ ...current, quantities: { ...current.quantities, [id]: steps } }))
  }
  return <Context.Provider value={{ configuration, selectedIds: configuration.selectedOptionIds, promotionalDiscount, toggleOption, setOptionQuantity,
    resetSelection: () => setSelection({ modelId: model.id, ids: [], quantities: {} }) }}>{children}</Context.Provider>
}

export function useModelConfiguration() {
  const context = useContext(Context)
  if (!context) throw new Error('ModelConfigurationProvider is required')
  return context
}
