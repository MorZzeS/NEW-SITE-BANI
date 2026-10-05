'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'light'}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={theme === 'dark' ? 'NIGHT — тёмная тема' : 'DAY — светлая тема'}
      onClick={toggle}
      className="theme-toggle"
    >
      <span className="theme-toggle-thumb" aria-hidden="true" />
      <Sun className="theme-toggle-sun" aria-hidden="true" />
      <Moon className="theme-toggle-moon" aria-hidden="true" />
    </button>
  )
}
