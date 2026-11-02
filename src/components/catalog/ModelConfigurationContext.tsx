'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Home, Sauna } from '@/types'
import { calculateModelConfiguration, type ModelConfigurationCalculation } from '@/lib/model-configuration-selection'
type ConfigurationContext = {
  configuration: ModelConfigurationCalculation
  selectedIds: string[]
  toggleOption: (id: string) => void
  resetSelection: () => void
}
const Context = createContext<ConfigurationContext | null>(null)
export function ModelConfigurationProvider({ model, children }: { model: Sauna | Home; children: ReactNode }) {
  const [selection, setSelection] = useState<{ modelId: string; ids: string[] }>({ modelId: model.id, ids: [] })
  const configuration = calculateModelConfiguration(model, selection.modelId === model.id ? selection.ids : [])
  function toggleOption(id: string) {
    setSelection(current => {
      const ids = current.modelId === model.id ? current.ids : []
      const next = calculateModelConfiguration(model, ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id])
      return { modelId: model.id, ids: next.selectedOptionIds }
    })
  }
  return <Context.Provider value={{ configuration, selectedIds: configuration.selectedOptionIds, toggleOption,
    resetSelection: () => setSelection({ modelId: model.id, ids: [] }) }}>{children}</Context.Provider>
}
export function useModelConfiguration() {
  const context = useContext(Context)
  if (!context) throw new Error('ModelConfigurationProvider is required')
  return context
}
