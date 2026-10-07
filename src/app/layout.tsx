import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { PageTransition } from '@/components/ui/PageTransition'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteSettings } from '@/data'
import { themeScript } from '@/lib/theme'

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
  keywords: ['мобильная баня', 'баня под ключ', 'купить баню', 'мобильный дом', 'баня на колёсах', 'Бани Герасимов', 'BANGER', 'Исток', 'Скандинавия', 'Север'],
  authors: [{ name: 'Бани Герасимов' }],
  metadataBase: new URL('https://banger.su'),
  alternates: {
    canonical: 'https://banger.su',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://banger.su',
    siteName: 'Бани Герасимов',
    title: 'Бани Герасимов — мобильные бани и дома под ключ',
    description: 'Производство и продажа мобильных бань и домов. Доставка и установка по Москве и Московской области.',
    images: [{
      url: 'https://banger.su/images/hero/hero-bg.webp',
      width: 1671,
      height: 941,
      alt: 'Бани Герасимов — мобильные бани и дома',
    }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Anti-flash theme script — runs before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: "if(location.pathname==='/'){const l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';l.href='/images/hero/hero-'+(document.documentElement.dataset.theme==='light'?'day':'night')+'.webp';document.head.appendChild(l)}" }} />
      </head>
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
