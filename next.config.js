/** @type {import('next').NextConfig} */
const isGitHubPagesProject = process.env.BANGER_GITHUB_PAGES === 'true'
const githubPagesBasePath = isGitHubPagesProject ? '/NEW-SITE-BANI' : ''

const nextConfig = {
  output: 'export',
  // Keep the root-hosted SpaceWeb export separate from the test Pages build.
  distDir: isGitHubPagesProject ? 'dist-pages' : 'dist',
  basePath: githubPagesBasePath,
  env: { NEXT_PUBLIC_BASE_PATH: githubPagesBasePath },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
