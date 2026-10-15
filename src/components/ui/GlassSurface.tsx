'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// Opt-in reflection host. A child marked glass-surface-target draws the highlight.
// Pointer movement writes CSS properties once per frame and never updates React state.
export function GlassSurface({ children, className = '' }: { children: ReactNode; className?: string }) {
  const surfaceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const surface = surfaceRef.current
    if (!surface) return
    const capability = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let enabled = capability.matches
    let frame = 0
    let clientX = 0
    let clientY = 0

    const reset = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      surface.style.setProperty('--glass-reflection-opacity', '0')
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { reset(); return }
      if (!enabled || document.hidden) return
      clientX = event.clientX
      clientY = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!enabled || document.hidden) return
        const target = surface.querySelector<HTMLElement>(':scope > .glass-surface-target') ?? surface
        const bounds = target.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return
        const x = Math.max(0, Math.min(100, (clientX - bounds.left) / bounds.width * 100))
        const y = Math.max(0, Math.min(100, (clientY - bounds.top) / bounds.height * 100))
        surface.style.setProperty('--glass-reflection-x', `${x.toFixed(2)}%`)
        surface.style.setProperty('--glass-reflection-y', `${y.toFixed(2)}%`)
        surface.style.setProperty('--glass-reflection-opacity', '1')
      })
    }
    const syncCapability = () => {
      enabled = capability.matches
      if (!enabled) reset()
    }
    const visibility = () => { if (document.hidden) reset() }
    surface.addEventListener('pointerenter', move, { passive: true })
    surface.addEventListener('pointermove', move, { passive: true })
    surface.addEventListener('pointerdown', reset)
    surface.addEventListener('pointerleave', reset)
    surface.addEventListener('pointercancel', reset)
    capability.addEventListener('change', syncCapability)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('blur', reset)
    window.addEventListener('pagehide', reset)
    window.addEventListener('scroll', reset, { passive: true })

    return () => {
      reset()
      surface.removeEventListener('pointerenter', move)
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerdown', reset)
      surface.removeEventListener('pointerleave', reset)
      surface.removeEventListener('pointercancel', reset)
      capability.removeEventListener('change', syncCapability)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('blur', reset)
      window.removeEventListener('pagehide', reset)
      window.removeEventListener('scroll', reset)
      surface.style.removeProperty('--glass-reflection-x')
      surface.style.removeProperty('--glass-reflection-y')
      surface.style.removeProperty('--glass-reflection-opacity')
    }
  }, [])

  return <div ref={surfaceRef} className={`glass-surface ${className}`}>{children}</div>
}
