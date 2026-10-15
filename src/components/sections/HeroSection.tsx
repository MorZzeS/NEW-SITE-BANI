'use client'
import { SocialBlock } from '@/components/ui/SocialBlock'


import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { HeroVideoAction } from '@/components/ui/HeroVideoAction'
import { HeroTrustReveal } from '@/components/ui/HeroTrustReveal'
import { homepageHeroImages } from '@/data/homepage'
import { ArrowRight } from 'lucide-react'

const BathVideoViewer = dynamic(() => import('@/components/ui/BathVideoViewer'), { ssr: false })

export function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [heroTheme, setHeroTheme] = useState<{
    initial: keyof typeof homepageHeroImages
    active: keyof typeof homepageHeroImages
    alternateReady: boolean
  } | null>(null)
  useEffect(() => {
    const root = document.documentElement
    const initial = root.dataset.theme === 'light' ? 'light' : 'dark'
    const alternate = initial === 'light' ? 'dark' : 'light'
    let disposed = false
    let generation = 0
    let alternateLoad: Promise<void> | null = null
    setHeroTheme({ initial, active: initial, alternateReady: false })

    const loadAlternate = (priority: 'low' | 'high') => {
      if (!alternateLoad) {
        const image = new window.Image()
        image.fetchPriority = priority
        image.src = homepageHeroImages[alternate]
        alternateLoad = image.decode().catch((error) => {
          alternateLoad = null
          throw error
        })
      }
      return alternateLoad
    }
    const sync = () => {
      const request = ++generation
      const next = root.dataset.theme === 'light' ? 'light' : 'dark'
      if (next === initial) {
        setHeroTheme((previous) => previous && { ...previous, active: initial })
        return
      }
      void loadAlternate('high').then(() => {
        if (disposed || request !== generation) return
        setHeroTheme({ initial, active: alternate, alternateReady: true })
      }).catch(() => { /* Keep the loaded photograph if the alternate cannot load. */ })
    }
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    const timer = setTimeout(() => {
      void loadAlternate('low').then(() => {
        if (!disposed) setHeroTheme((previous) => previous && { ...previous, alternateReady: true })
      }).catch(() => {})
    }, 3000)
    return () => {
      disposed = true
      generation++
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])
  return (
    <section className="theme-hero relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="hero-scene absolute inset-0 z-0">
        <div
          className="hero-theme-render absolute inset-0"
          role="img"
          aria-label="Визуализация нашей бани на природе"
          style={heroTheme ? { backgroundImage: `url('${homepageHeroImages[heroTheme.initial]}')` } : undefined}
        />
        <div
          className="hero-theme-alternate absolute inset-0"
          aria-hidden="true"
          data-visible={heroTheme !== null && heroTheme.active !== heroTheme.initial}
          style={heroTheme?.alternateReady ? { backgroundImage: `url('${homepageHeroImages[heroTheme.initial === 'light' ? 'dark' : 'light']}')` } : undefined}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main hero content — pushed down from nav */}
        <div className="hero-main-content flex-1 flex items-center pt-28 pb-8 md:pb-10">
          <div className="site-container w-full">
            <div className="flex flex-col xl:flex-row items-start justify-between gap-8">
              {/* Left: Text content */}
              <div className="max-w-xl xl:max-w-2xl">
                {/* Headline */}
                <h1
                  className="hero-headline hero-reveal text-[40px] sm:text-5xl xl:text-[64px] font-bold leading-[1.08] tracking-tight mb-5"
                  style={{ animationDelay: '0.12s' }}
                >
                  <span>Мобильные бани</span>
                  <br />
                  <span>и дома под ключ</span>
                </h1>

                {/* Subheading */}
                <p
                  className="hero-subheading hero-reveal text-base sm:text-lg leading-relaxed mb-6 max-w-md"
                  style={{ animationDelay: '0.22s' }}
                >
                  Современные, тёплые, надёжные.<br />
                  Доставим и установим по Москве и Московской области.
                </p>

                {/* CTAs */}
                <div className="hero-actions hero-reveal flex flex-col items-stretch gap-3" style={{ animationDelay: '0.32s' }}>
                  <Link href="/katalog/bani" className="btn-primary justify-center text-sm px-7 py-3.5">
                    Смотреть каталог
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <HeroVideoAction onClick={() => setVideoOpen(true)} />
                </div>
              </div>

              <SocialBlock compact />
            </div>
          </div>
        </div>

        {/* Bottom: approved Glass Reveal trust strip */}
        <div className="relative z-10 pb-6">
          <div className="site-container">
            <HeroTrustReveal />
          </div>
        </div>
      </div>
      {videoOpen && <BathVideoViewer onClose={() => setVideoOpen(false)} />}
    </section>
  )
}
