export const exteriorFinishOptionIds = ['exterior-imitation-board', 'exterior-blockhouse', 'exterior-profile-sheet'] as const
export const DEFAULT_EXTERIOR_FINISH_ID = exteriorFinishOptionIds[0]

/** Preserve current options and supply the standard zero-price finish for supported bath models. */
export function withDefaultExteriorFinish(modelType: 'sauna' | 'home', modelSlug: string, ids: readonly string[]): string[] {
  if (modelType !== 'sauna' || modelSlug === 'barn-premium') return [...ids]
  if (ids.some(id => exteriorFinishOptionIds.includes(id as typeof exteriorFinishOptionIds[number]))) return [...ids]
  return [...ids, DEFAULT_EXTERIOR_FINISH_ID]
}

export function toggleExclusiveGroup(ids: readonly string[], id: string, groupIds: readonly string[]): string[] {
  if (ids.includes(id)) return ids.filter(value => value !== id)
  return [...ids.filter(value => !groupIds.includes(value)), id]
}
