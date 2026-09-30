import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { PageTransition } from '@/components/ui/PageTransition'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteSettings } from '@/data'

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
  description: 'Производство и продажа мобильных бань и домов. Доставка и установка по Москве и Московской области. Собственное производство, гарантия качества.',
  keywords: ['мобильная баня', 'баня под ключ', 'купить баню', 'мобильный дом', 'баня на колёсах', 'Бани Герасимов', 'BANGER', 'БГ-01', 'БГ-12', 'Исток'],
  authors: [{ name: 'Бани Герасимов' }],
  metadataBase: new URL('https://banger.su'),
  openGraph: {
    type: 'website', locale: 'ru_RU', url: 'https://banger.su',
    siteName: 'Бани Герасимов',
    title: 'Бани Герасимов — мобильные бани и дома под ключ',
    description: 'Производство и продажа мобильных бань и домов. Доставка и установка по Москве и Московской области.',
    images: [{ url: '/images/hero/hero-bg.png', width: 1671, height: 941 }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header settings={siteSettings} />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={siteSettings} />
        </ThemeProvider>
      </body>
    </html>
  )
}
