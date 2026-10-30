

// Production/SpaceWeb is rooted at /; the isolated GitHub Pages test build
// gets its project subpath at build time through next.config.js.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function withBasePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  if (path === basePath || path.startsWith(`${basePath}/`)) return path
  return `${basePath}${path}`
}

// Article HTML comes from our local catalog data, not from user input.
export function articleHtmlWithBasePath(html: string, homeSlugs: string[]): string {
  return html.replace(/\b(href|src|srcset)=(['"])([^'"]+)\2/g, (_, attr, quote, url: string) => {
    const home = homeSlugs.find((slug) => url === `/banya/${slug}`)
    const path = home ? `/dom/${home}` : url.replace(/^(\/poleznoe\/[^/?#]+)\/(?=[?#]|$)/, '$1')
    // `srcset` may contain several comma-separated candidates; prefix each
    // local URL while preserving descriptors such as `2x` or `640w`.
    const value = attr === 'srcset'
      ? url.split(',').map((candidate) => {
          const [candidateUrl, ...descriptor] = candidate.trim().split(/\s+/)
          const candidateHome = homeSlugs.find((slug) => candidateUrl === `/banya/${slug}`)
          const candidatePath = candidateHome ? `/dom/${candidateHome}` : candidateUrl.replace(/^(\/poleznoe\/[^/?#]+)\/(?=[?#]|$)/, '$1')
          return [withBasePath(candidatePath), ...descriptor].join(' ')
        }).join(', ')
      : withBasePath(path)
    return `${attr}=${quote}${value}${quote}`
  })
}
