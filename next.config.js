const { readLeadBuildDocuments } = require('./scripts/lead-build-documents.cjs')
const isGitHubPagesProject = process.env.BANGER_GITHUB_PAGES === 'true'
const githubPagesBasePath = isGitHubPagesProject ? '/NEW-SITE-BANI' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Keep the root-hosted SpaceWeb export separate from the test Pages build.
  distDir: isGitHubPagesProject ? 'dist-pages' : 'dist',
  basePath: githubPagesBasePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
    BANGER_COMPILED_LEAD_DOCUMENTS: JSON.stringify(readLeadBuildDocuments(process.env)),
  },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
