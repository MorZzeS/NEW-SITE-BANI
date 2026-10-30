/**
 * Card-sized derivatives keep catalog grids from downloading the original
 * multi-megabyte PNG. The source path remains the canonical model image for
 * detail pages and galleries.
 */
export function catalogCardImage(source: string, format: 'webp' | 'avif' = 'webp') {
  return withBasePath(source.replace(/\/model\.(?:png|jpe?g)$/i, `/model-card.${format}`))
}
import { withBasePath } from '@/lib/site-path'