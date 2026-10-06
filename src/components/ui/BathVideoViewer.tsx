'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Play, Volume2, VolumeX, X } from 'lucide-react'
import { bathVideos, bathVideoAction, type BathVideo } from '@/data/videos'

const videos = [...bathVideos].sort((a, b) => a.order - b.order)

function VideoPlayer({ video, muted, onMutedChange }: {
  video: BathVideo
  muted: boolean
  onMutedChange: (value: boolean) => void
}) {
  const player = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = player.current
    if (!element) return
    // This component exists only after the owner video CTA has been activated.
    element.play().catch(() => { /* Native controls provide manual play if blocked. */ })
    return () => {
      element.pause()
      element.removeAttribute('src')
      element.load()
    }
  }, [])
  return <>
    <video ref={player} src={video.src} poster={video.poster} muted={muted}
      controls playsInline preload="metadata" aria-label={video.title}
      onVolumeChange={(event) => onMutedChange(event.currentTarget.muted)}
      onError={() => setFailed(true)} />
    {failed && <p role="alert" className="bath-viewer-error">Не удалось загрузить видео. Попробуйте открыть просмотр позже.</p>}
  </>
}

export default function BathVideoViewer({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const video = videos[index]
  const move = (offset: number) => {
    if (videos.length > 1) {
      setIndex((current) => (current + offset + videos.length) % videos.length)
      setMuted(true)
    }
  }

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const previousFocus = document.activeElement as HTMLElement | null
    const body = document.body
    const old = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow }
    const scrollY = window.scrollY
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    element.showModal()
    closeButton.current?.focus()
    return () => {
      element.close()
      Object.assign(body.style, old)
      window.scrollTo(0, scrollY)
      previousFocus?.focus()
    }
  }, [])

  return createPortal(
    <dialog ref={dialog} className="bath-viewer" aria-labelledby="bath-viewer-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      onKeyDown={(event) => {
        const target = event.target as HTMLElement
        if (target.tagName !== 'VIDEO' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1)
        }
        // Native modal makes the rest of the page inert; keep keyboard focus in the panel.
        if (event.key === 'Tab') {
          const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), video[controls]'))
          const first = buttons[0], last = buttons[buttons.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }
      }}>
      <div className="bath-viewer-panel">
        <header className="bath-viewer-header">
          <div>
            <p className="bath-viewer-eyebrow">{bathVideoAction.caption}</p>
            <h2 id="bath-viewer-title">{video?.title ?? bathVideoAction.title}</h2>
          </div>
          <button ref={closeButton} type="button" className="bath-viewer-control" aria-label="Закрыть просмотр видео" onClick={onClose}><X aria-hidden="true" size={20} /></button>
        </header>
        <div className="bath-viewer-stage"
          onPointerDown={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            if (event.clientY < bounds.bottom - 48) swipeStart.current = { x: event.clientX, y: event.clientY }
          }}
          onPointerUp={(event) => {
            const start = swipeStart.current, end = event
            swipeStart.current = null
            if (start && end) {
              const dx = end.clientX - start.x, dy = end.clientY - start.y
              if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
            }
          }} onPointerCancel={() => { swipeStart.current = null }} onPointerLeave={() => { swipeStart.current = null }}>
          {video ? <VideoPlayer key={video.id} video={video} muted={muted} onMutedChange={setMuted} /> :
            <div className="bath-viewer-empty">
              <Play aria-hidden="true" size={28} strokeWidth={1.5} />
              <p>Видео скоро появятся</p>
              <span>Здесь будут короткие видео наших бань изнутри.</span>
            </div>}
        </div>
        <footer className="bath-viewer-footer">
          <button type="button" className="bath-viewer-control" aria-label="Предыдущее видео" disabled={videos.length < 2} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" size={20} /></button>
          <p aria-live="polite" aria-atomic="true">{video ? `${index + 1} / ${videos.length}` : 'Пока нет роликов'}{video?.duration && <span> · {video.duration}</span>}</p>
          <button type="button" className="bath-viewer-control" aria-label="Следующее видео" disabled={videos.length < 2} onClick={() => move(1)}><ArrowRight aria-hidden="true" size={20} /></button>
          <button type="button" className="bath-viewer-control bath-viewer-sound" aria-label={muted ? 'Включить звук' : 'Выключить звук'} aria-pressed={!muted} disabled={!video} onClick={() => setMuted(!muted)}>{muted ? <VolumeX aria-hidden="true" size={20} /> : <Volume2 aria-hidden="true" size={20} />}</button>
        </footer>
        {!!videos.length && <nav className="bath-viewer-playlist" aria-label="Выбрать видео">
          {videos.map((item, itemIndex) => <button key={item.id} type="button" aria-current={itemIndex === index ? 'true' : undefined}
            onClick={() => { setIndex(itemIndex); setMuted(true) }}>
            <span>{itemIndex + 1}. {item.title}</span><span>{item.duration}</span>
          </button>)}
        </nav>}
      </div>
    </dialog>, document.body
  )
}
