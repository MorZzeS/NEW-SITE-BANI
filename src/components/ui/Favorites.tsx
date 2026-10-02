'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export function Favorites() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('banger-favorites')
    if (stored) {
      try { setCount(JSON.parse(stored).length || 0) } catch { setCount(0) }
    }
  }, [])

  return (
    <button
      type="button"
      aria-label="Избранное"
      className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream transition-colors cursor-pointer"
    >
      <Heart className="w-4 h-4 text-gold-400" />
      <span>Избранное</span>
      {count > 0 && (
        <span className="ml-0.5 bg-gold-400/20 text-gold-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">{count}</span>
      )}
    </button>
  )
}
