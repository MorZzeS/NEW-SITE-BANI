'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { isTheme, type Theme } from '@/lib/theme'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const apply = (next: Theme) => {
      document.documentElement.setAttribute('data-theme', next)
      setTheme(next)
    }
    const initial = document.documentElement.getAttribute('data-theme')
    apply(isTheme(initial) ? initial : media.matches ? 'light' : 'dark')
    const sync = () => {
      let saved: string | null = null
      try { saved = localStorage.getItem('banger-theme') } catch {}
      apply(isTheme(saved) ? saved : media.matches ? 'light' : 'dark')
    }
    const storage = (event: StorageEvent) => {
      if (event.key === 'banger-theme' || event.key === null) sync()
    }
    media.addEventListener('change', sync)
    window.addEventListener('storage', storage)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('storage', storage)
      clearTimeout(transitionTimer.current)
      document.documentElement.classList.remove('theme-changing')
    }
  }, [])

  const toggle = () => {
    const next: Theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.add('theme-changing')
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => document.documentElement.classList.remove('theme-changing'), 220)
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('banger-theme', next) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
