'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Eye } from 'lucide-react'
import { getModelViewCount, loadModelViewCounts, startModelViewTracking, subscribeModelViewCounts } from '@/lib/model-view-counter'
import styles from './CatalogCard.module.css'

export function ModelViewTracker({ modelId }: { modelId: string }) {
  const countedModel = useRef<string | null>(null)
  useEffect(() => {
    if (countedModel.current === modelId) return
    countedModel.current = modelId
    startModelViewTracking(modelId)
  }, [modelId])
  return null
}

export function ModelViewCount({ modelId }: { modelId: string }) {
  useEffect(() => { void loadModelViewCounts() }, [])
  const count = useSyncExternalStore(subscribeModelViewCounts, () => getModelViewCount(modelId), () => null)
  if (count === null) return null
  return <span className={styles.modelViews} aria-label={`Просмотров: ${count}`} title="Просмотров">
    <Eye aria-hidden="true" size={14} />
    <span>Просмотров</span>
    <span>{count.toLocaleString('ru-RU')}</span>
  </span>
}
