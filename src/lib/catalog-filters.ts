/** Returns the longest side from a human-readable model dimension string. */
export function longestDimensionInMeters(size: string): number {
  const dimensions = [...size.replace(/,/g, '.').matchAll(/[0-9]+(?:\.[0-9]+)?/g)]
    .map((match) => Number(match[0]))
    .filter(Number.isFinite)

  return dimensions.length ? Math.max(...dimensions) : 0
}

export type BudgetLimit = number | '' | undefined
export type PriceSort = 'asc' | 'desc'

/** Inclusive base-price filter used by both public catalogues. */
export function filterByBudget<T extends { priceFrom: number }>(
  products: readonly T[],
  minimum: BudgetLimit = 0,
  maximum: BudgetLimit = '',
): T[] {
  const min = typeof minimum === 'number' && Number.isFinite(minimum) ? Math.max(0, minimum) : 0
  const max = typeof maximum === 'number' && Number.isFinite(maximum) ? Math.max(0, maximum) : undefined
  return products.filter((product) => product.priceFrom >= min && (max === undefined || product.priceFrom <= max))
}

/** Return a copy so catalog source order/data are never mutated by sorting. */
export function sortByPrice<T extends { priceFrom: number }>(products: readonly T[], direction: PriceSort): T[] {
  return [...products].sort((a, b) => direction === 'asc' ? a.priceFrom - b.priceFrom : b.priceFrom - a.priceFrom)
}
