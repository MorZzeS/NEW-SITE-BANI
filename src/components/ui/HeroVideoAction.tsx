'use client'

import { Play } from 'lucide-react'
import { bathVideoAction } from '@/data/videos'

// Set to false to restore the previous hero CTA without changing playback.
export const USE_INTERIOR_VIDEO_CTA = true

export function HeroVideoAction({ onClick }: { onClick: () => void }) {
  if (!USE_INTERIOR_VIDEO_CTA) {
    return (
      <button type="button" aria-haspopup="dialog" onClick={onClick} className="flex items-center gap-3 text-sm text-cream/80 hover:text-cream transition-colors group min-h-11 text-left">
        <div className="w-11 h-11 glass rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
          <Play className="w-4 h-4 text-cream fill-current ml-0.5" />
        </div>
        <span><span className="block font-medium">{bathVideoAction.title}</span><span className="block text-xs text-cream/75 mt-0.5">{bathVideoAction.caption}</span></span>
      </button>
    )
  }

  return (
    <button type="button" aria-haspopup="dialog" onClick={onClick} className="hero-video-action group">
      <span className="hero-video-play" aria-hidden="true">
        <Play className="w-5 h-5 fill-current ml-0.5" />
      </span>
      <span>Смотреть видео изнутри</span>
    </button>
  )
}
