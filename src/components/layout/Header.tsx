'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown, MessageCircle } from 'lucide-react'
import type { SiteSettings } from '@/types'
import clsx from 'clsx'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface Props {
  settings: SiteSettings
}

const navItems = [
  {
    label: 'Каталог',
    href: '/katalog',
    children: [
      { label: 'Мобильные бани', href: '/katalog/bani', desc: 'Серии Исток, Север, Скандинавия' },
      { label: 'Мобильные дома', href: '/katalog/doma', desc: 'Серия Усадьба' },
    ],
  },
  { label: 'Как устроено', href: '/kak-ustroeno' },
  { label: 'Комплектация', href: '/komplektaciya' },
  { label: 'Наши работы', href: '/nashi-raboty' },
  { label: 'Полезное', href: '/poleznoe' },
  { label: 'Доставка и установка', href: '/dostavka-i-ustanovka' },
  { label: 'О компании', href: '/o-kompanii' },
]

export function Header({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-dark-strong py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="site-container flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
              'bg-gradient-to-br from-gold-400 to-wood-600 shadow-gold group-hover:shadow-gold'
            )}>
              <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <path d="M4 14L16 4L28 14V28H4V14Z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
                <path d="M12 28V20H20V28" stroke="white" strokeWidth="2"/>
                <path d="M16 8L6 17" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <circle cx="23" cy="11" r="1.5" fill="rgba(255,255,255,0.7)"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-cream tracking-wide">БАНИ ГЕРАСИМОВ</div>
              <div className="text-[10px] text-cream/50 uppercase tracking-widest">Производство мобильных бань</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav ref={dropRef} className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setDropdown(dropdown === item.label ? null : item.label)}
                    className="nav-link flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/8"
                  >
                    {item.label}
                    <ChevronDown className={clsx(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      dropdown === item.label ? 'rotate-180' : ''
                    )} />
                  </button>
                  {dropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-dark-strong rounded-2xl p-2 z-20 animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDropdown(null)}
                          className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/8 transition-colors group"
                        >
                          <span className="text-sm font-semibold text-cream group-hover:text-gold-300 transition-colors">
                            {child.label}
                          </span>
                          <span className="text-xs text-cream/50 mt-0.5">{child.desc}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="nav-link px-3 py-2 rounded-lg hover:bg-white/8">
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-cream/90 hover:text-cream transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              {settings.phoneDisplay}
            </a>
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex btn-secondary px-4 py-2 text-xs rounded-xl"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <Link href="/kontakty#zayavka" className="btn-primary px-4 py-2.5 text-xs hidden sm:flex">
              Заказать звонок
            </Link>
            <ThemeToggle />
            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden glass rounded-xl p-2.5 text-cream"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-graphite-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 right-0 h-full w-80 max-w-[90vw] glass-dark-strong pt-24 pb-8 px-6 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <div className="px-4 py-2 text-xs font-semibold tracking-widest uppercase text-cream/40 mt-4">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 rounded-xl text-cream/80 hover:bg-white/8 hover:text-cream transition-all text-sm font-medium"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-cream/80 hover:bg-white/8 hover:text-cream transition-all text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 px-4 py-3 glass rounded-xl text-cream text-sm">
                <Phone className="w-4 h-4 text-gold-400" />
                {settings.phoneDisplay}
              </a>
              <Link
                href="/kontakty#zayavka"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Заказать звонок
              </Link>
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Написать в WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
