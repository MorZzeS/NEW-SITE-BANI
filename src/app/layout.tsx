import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/sections/real-works.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { PageTransition } from '@/components/ui/PageTransition'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import CookieConsent from '@/components/privacy/CookieConsent'
import { siteSettings } from '@/data'
import { themeScript } from '@/lib/theme'
import { basePath, withBasePath } from '@/lib/site-path'

const isGitHubPagesProject = basePath === '/NEW-SITE-BANI'
const homepagePath = isGitHubPagesProject ? `${basePath}/` : '/'
const heroPreloadPrefix = withBasePath('/images/hero/hero-')
const heroPreloadScript = `if(location.pathname===${JSON.stringify(homepagePath)}){const l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';l.href=${JSON.stringify(heroPreloadPrefix)}+(document.documentElement.dataset.theme==='light'?'day':'night')+'.webp';document.head.appendChild(l)}`
const heroImageVariables = {
  '--hero-night-image': `url("${withBasePath('/images/hero/hero-night.webp')}")`,
  '--hero-day-image': `url("${withBasePath('/images/hero/hero-day.webp')}")`,
} as CSSProperties

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Бани Герасимов — мобильные бани и дома под ключ',
    template: '%s | Бани Герасимов',
  },
  description: 'Производство и продажа мобильных бань и домов. Доставка и установка по Москве и регионам Центральной России. Собственное производство, гарантия качества.',
  keywords: ['мобильная баня', 'баня под ключ', 'купить баню', 'мобильный дом', 'баня на колёсах', 'Бани Герасимов', 'BANGER', 'Исток', 'Скандинавия', 'Север'],
  authors: [{ name: 'Бани Герасимов' }],
  metadataBase: new URL('https://banger.su'),
  icons: {
    icon: [
      { url: withBasePath('/favicon.ico'), sizes: '32x32', type: 'image/x-icon' },
      { url: withBasePath('/icon.svg'), type: 'image/svg+xml' },
      { url: withBasePath('/icon-32.png'), sizes: '32x32', type: 'image/png' },
      { url: withBasePath('/icon-192.png'), sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: withBasePath('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: 'https://banger.su',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://banger.su',
    siteName: 'Бани Герасимов',
    title: 'Бани Герасимов — мобильные бани и дома под ключ',
    description: 'Производство и продажа мобильных бань и домов. Доставка и установка по Москве и регионам Центральной России.',
    images: [{
      url: 'https://banger.su/images/hero/hero-bg.webp',
      width: 1671,
      height: 941,
      alt: 'Бани Герасимов — мобильные бани и дома',
    }],
  },
  robots: { index: !isGitHubPagesProject, follow: !isGitHubPagesProject },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable} style={heroImageVariables} suppressHydrationWarning>
      <head>
        {/* Anti-flash theme script — runs before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: heroPreloadScript }} />
      </head>
      <body className="min-h-screen flex flex-col" data-release-profile="visual-contacts">
        <ThemeProvider>
          <Header settings={siteSettings} />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={siteSettings} />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
