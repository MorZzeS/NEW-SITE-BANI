'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className="relative flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-300 glass border border-white/20 hover:border-white/30"
      style={{ minWidth: 64 }}
    >
      {/* Track */}
      <span
        className="absolute inset-0.5 rounded-full transition-all duration-300"
        style={{
          background: theme === 'light'
            ? 'linear-gradient(135deg, #f5f0e8 60%, #d4a843 100%)'
            : 'linear-gradient(135deg, rgba(30,35,48,0.7) 60%, rgba(30,35,48,0.3) 100%)',
        }}
      />
      {/* Icons */}
      <span className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${theme === 'light' ? 'translate-x-[26px]' : 'translate-x-0'}`}
        style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(212,168,67,0.3)' }}
      >
        {theme === 'dark'
          ? <Moon className="w-3.5 h-3.5 text-cream" />
          : <Sun className="w-3.5 h-3.5 text-wood-700" />
        }
      </span>
      <span className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${theme === 'light' ? 'translate-x-0' : 'translate-x-[26px]'}`}>
        {theme === 'dark'
          ? <Sun className="w-3.5 h-3.5 text-cream/40" />
          : <Moon className="w-3.5 h-3.5 text-graphite-400/60" />
        }
      </span>
    </button>
  )
}
