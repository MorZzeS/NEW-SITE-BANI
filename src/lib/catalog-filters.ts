/** Returns the longest side from a human-readable model dimension string. */
export function longestDimensionInMeters(size: string): number {
  const dimensions = [...size.replace(/,/g, '.').matchAll(/[0-9]+(?:\.[0-9]+)?/g)]
    .map((match) => Number(match[0]))
    .filter(Number.isFinite)

  return dimensions.length ? Math.max(...dimensions) : 0
}
