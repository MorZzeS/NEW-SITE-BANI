import nextConfig from '../../next.config'

export const basePath = nextConfig.basePath || ''

export function withBasePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  if (path === basePath || path.startsWith(`${basePath}/`)) return path
  return `${basePath}${path}`
}

// Article HTML comes from our local catalog data, not from user input.
export function articleHtmlWithBasePath(html: string, homeSlugs: string[]): string {
  return html.replace(/\b(href|src)=(['"])([^'"]+)\2/g, (_, attr, quote, url: string) => {
    const home = homeSlugs.find((slug) => url === `/banya/${slug}`)
    const path = home ? `/dom/${home}` : url
    return `${attr}=${quote}${withBasePath(path)}${quote}`
  })
}
