'use client'

import { useEffect, useRef } from 'react'
import { Factory, Shield, Truck, Wrench } from 'lucide-react'
import { homepageTrustItems } from '@/data/homepage'
import Link from 'next/link'

const icons = { production: Factory, delivery: Truck, installation: Wrench, warranty: Shield }
const destinations = { production: '/o-kompanii#production', delivery: '/dostavka-i-ustanovka#delivery', installation: '/dostavka-i-ustanovka#installation', warranty: '/garantiya' }

// Real destinations keep the decorative glass panel useful without reveal tooltips.
export function HeroTrustReveal() {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = panel.current
    if (!element || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.dataset.entered = 'true'
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={panel} className="hero-trust-strip hero-trust-panel">
      <ul className="hero-trust-options grid auto-rows-fr grid-cols-2 md:grid-cols-4" aria-label="Производство, доставка, установка и гарантия">
        {homepageTrustItems.map(item => {
          const Icon = icons[item.id]
          return <li key={item.id} className="hero-trust-item">
            <Link href={destinations[item.id]} className="hero-trust-content flex items-start gap-2.5 px-3 py-4 sm:px-5 rounded-xl focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-[-3px] hover:bg-white/5 transition-colors">
              <Icon aria-hidden="true" className="hero-trust-icon w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="min-w-0">
                <span className="block text-sm font-semibold leading-5">{item.title}</span>
                <span className="hero-trust-caption block text-xs leading-5 mt-1">{item.caption}</span>
              </div>
            </Link>
          </li>
        })}
      </ul>
    </div>
  )
}
