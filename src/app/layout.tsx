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
      url: 'https://banger.su/NEW-SITE-BANI/images/hero/hero-bg.webp',
      width: 1671,
      height: 941,
      alt: 'Бани Герасимов — мобильные бани и дома',
    }],
  },
  robots: { index: true, follow: true },
}

// Anti-flash: применяем тему до гидратации React
const themeScript = `
(function(){
  try{
    var s=localStorage.getItem('banger-theme');
    var p=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';
    document.documentElement.setAttribute('data-theme',s||p);
  }catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* Anti-flash theme script — runs before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
