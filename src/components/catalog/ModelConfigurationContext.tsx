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
  resetSelection: () => void
}
const Context = createContext<ConfigurationContext | null>(null)

/** URL-driven state only: the owner-approved 15 000 ₽ offer is shown only for baths opened from the promo. */
function promotionFromLocation() {
  if (typeof window === 'undefined') return false
  try { return new URLSearchParams(window.location.search).get('source') === 'exit-intent' } catch { return false }
}

export function ModelConfigurationProvider({ model, children }: { model: Sauna | Home; children: ReactNode }) {
  const [selection, setSelection] = useState<{ modelId: string; ids: string[] }>({ modelId: model.id, ids: [] })
  const [promotionalDiscount, setPromotionalDiscount] = useState(false)
  const allowed = new Set(modelOptionAvailability(model).filter(row => row.status === 'available').map(row => row.option.id))
  useEffect(() => { setPromotionalDiscount(promotionFromLocation()) }, [model.id])
  const configuration = calculateModelConfiguration(model, selection.modelId === model.id ? selection.ids : [], { promotionalDiscount })
  function toggleOption(id: string) {
    if (!allowed.has(id)) return
    setSelection(current => {
      const ids = current.modelId === model.id ? current.ids : []
      const next = calculateModelConfiguration(model, ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id], { promotionalDiscount })
      return { modelId: model.id, ids: next.selectedOptionIds }
    })
  }
  return <Context.Provider value={{ configuration, selectedIds: configuration.selectedOptionIds, promotionalDiscount, toggleOption,
    resetSelection: () => setSelection({ modelId: model.id, ids: [] }) }}>{children}</Context.Provider>
}

export function useModelConfiguration() {
  const context = useContext(Context)
  if (!context) throw new Error('ModelConfigurationProvider is required')
  return context
}
