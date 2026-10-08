'use client'
import { PhoneLinks } from '@/components/ui/PhoneLinks'


import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import type { SiteSettings } from '@/types'
import clsx from 'clsx'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface Props {
  settings: SiteSettings
}

const navItems = [
  {
    label: 'Каталог',
    href: '/katalog/bani',
    children: [
      { label: 'Мобильные бани', href: '/katalog/bani', desc: 'Серии Исток, Север, Скандинавия' },
      { label: 'Мобильные дома', href: '/katalog/doma', desc: 'Серия Усадьба' },
      { label: 'Планировки', href: '/planirovki', desc: 'Готовые варианты' },
    ],
  },
  { label: 'Комплектация', href: '/komplektaciya' },
  { label: 'Полезное', href: '/poleznoe' },
  { label: 'О нас', href: '/o-kompanii' },
]

export function Header({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const mobileTrigger = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const menuTransition = { duration: reducedMotion ? 0 : .18, ease: [.22, 1, .36, 1] as [number, number, number, number] }

  useEffect(() => {
    if (!mobileOpen && !dropdown) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setDropdown(null); setMobileOpen(false)
      if (mobileOpen) mobileTrigger.current?.focus()
      else dropRef.current?.querySelector<HTMLButtonElement>("button")?.focus()
    }
    const overflow = document.body.style.overflow
    if (mobileOpen) document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", onKey) }
  }, [mobileOpen, dropdown])

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1280) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <header
        className={clsx(
          'site-header fixed top-0 inset-x-0 z-50 py-4 transition-[background-color,border-color,box-shadow] duration-200',
          scrolled && 'is-scrolled'
        )}
      >
        <div className="site-container header-layout">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group min-w-0">
            <div className={clsx(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0',
              'bg-gradient-to-br from-[#d4a843] to-[#c4762e] shadow-[0_4px_14px_rgba(196,118,46,0.4)]',
              'group-hover:shadow-[0_6px_20px_rgba(196,118,46,0.55)]'
            )}>
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
                <path d="M4 14L16 4L28 14V28H4V14Z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
                <path d="M12 28V20H20V28" stroke="white" strokeWidth="2"/>
                <path d="M16 8L6 17" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <circle cx="23" cy="11" r="1.5" fill="rgba(255,255,255,0.7)"/>
              </svg>
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-sm font-bold text-cream tracking-wide truncate">БАНИ ГЕРАСИМОВ</div>
              <div className="text-[10px] text-cream/50 uppercase tracking-widest hidden sm:block">Производство мобильных бань</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav ref={dropRef} className="header-desktop-nav items-center gap-0.5" aria-label="Основная навигация">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setDropdown(dropdown === item.label ? null : item.label)}
                    aria-expanded={dropdown === item.label}
                    aria-haspopup="true"
                    className={clsx(
                      'flex items-center gap-1 px-3 py-2 rounded-lg header-nav-item transition-all duration-200',
                      'text-cream/80 hover:text-cream hover:bg-white/10',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/60',
                      dropdown === item.label && 'text-cream bg-white/10'
                    )}
                  >
                    {item.label}
                    <ChevronDown className={clsx(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      dropdown === item.label ? 'rotate-180' : ''
                    )} />
                  </button>
                  <AnimatePresence>{dropdown === item.label && (
                    <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }} transition={menuTransition} className="absolute top-full left-0 mt-2 w-64 glass-dark-strong rounded-xl p-2 z-20 shadow-xl border border-white/10">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDropdown(null)}
                          className={clsx(
                            'flex flex-col px-4 py-3 rounded-xl transition-all duration-150 group',
                            'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/60'
                          )}
                        >
                          <span className="text-sm font-semibold text-cream group-hover:text-[#d4a843] transition-colors">
                            {child.label}
                          </span>
                          <span className="text-xs text-cream/50 mt-0.5">{child.desc}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}</AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-3 py-2 rounded-lg header-nav-item transition-all duration-200',
                    'text-cream/80 hover:text-cream hover:bg-white/10',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/60'
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <PhoneLinks className="header-phone-links" />

          {/* Right controls */}
          <div className="header-controls flex items-center gap-2 shrink-0">
            <Link
              href="/kontakty#zayavka"
              className="btn-primary px-4 py-2 text-xs hidden sm:flex rounded-xl"
            >
              Заказать звонок
            </Link>
            <ThemeToggle />
            {/* Mobile burger */}
            <button
              ref={mobileTrigger}
              onClick={() => setMobileOpen(!mobileOpen)}
              className={clsx(
                'header-menu-trigger rounded-xl p-2 transition-all duration-200',
                'bg-white/10 hover:bg-white/18 border border-white/15 text-cream',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]/60'
              )}
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>{mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={menuTransition} className="theme-mobile-menu fixed inset-0 z-40 header-mobile-panel">
          <div
            className="absolute inset-0 bg-graphite-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <motion.nav initial={{ x: reducedMotion ? 0 : 24 }} animate={{ x: 0 }} exit={{ x: reducedMotion ? 0 : 24 }} transition={menuTransition}
            className="absolute top-0 right-0 h-full w-80 max-w-[90vw] glass-dark-strong pt-20 pb-8 px-5 overflow-y-auto"
            aria-label="Мобильная навигация"
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/8 hover:bg-white/15 text-cream/70 hover:text-cream transition-all"
              aria-label="Закрыть меню"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <div className="px-4 py-2 text-xs font-semibold tracking-widest uppercase text-cream/40 mt-4 mb-1">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 rounded-xl text-cream/80 hover:bg-white/10 hover:text-cream transition-all text-sm font-medium min-h-[48px]"
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
                    className="flex items-center px-4 py-3 rounded-xl text-cream/80 hover:bg-white/10 hover:text-cream transition-all text-sm font-medium min-h-[48px]"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Contacts block — NO WhatsApp */}
            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              <PhoneLinks />
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/8 border border-white/10 rounded-xl text-cream text-sm min-h-[52px] hover:bg-white/12 transition-colors font-medium"
              >
                Telegram
              </a>
              <a
                href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/8 border border-white/10 rounded-xl text-cream text-sm min-h-[52px] hover:bg-white/12 transition-colors font-medium"
              >
                MAX
              </a>
              <Link
                href="/kontakty#zayavka"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center min-h-[52px]"
              >
                Заказать звонок
              </Link>
            </div>
          </motion.nav>
        </motion.div>
      )}</AnimatePresence>
    </>
  )
}
