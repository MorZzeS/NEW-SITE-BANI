'use client'

import { Play } from 'lucide-react'
import { GlassSurface } from '@/components/ui/GlassSurface'
export function HeroVideoAction({ onClick }: { onClick: () => void }) {
  return (
    <GlassSurface className="hero-video-surface">
      <button type="button" aria-haspopup="dialog" onClick={onClick} className="hero-video-action glass-surface-target group">
        <Play aria-hidden="true" className="w-4 h-4 fill-current shrink-0" />
        <span>Смотреть видео изнутри</span>
      </button>
    </GlassSurface>
  )
}
