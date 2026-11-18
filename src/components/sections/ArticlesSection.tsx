'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { articles } from '@/data'
import { withBasePath } from '@/lib/site-path'
import { articleCoverPositions } from '@/data/article-visuals'
import styles from './ArticlesSection.module.css'

const count = articles.length
const wrap = (value: number) => (value + count) % count
const distance = (index: number, active: number) => ((index - active + count + Math.floor(count / 2)) % count) - Math.floor(count / 2)

export function ArticlesSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null)
  const dragged = useRef(false)
  const move = (step: number) => {
    setPaused(true)
    setActive(value => wrap(value + step))
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused || reduced || hovered || focused || count < 2) return
    const timer = window.setInterval(() => setActive(value => wrap(value + 1)), 6000)
    return () => window.clearInterval(timer)
  }, [paused, reduced, hovered, focused])

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current
    pointer.current = null
    if (!start || start.id !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      dragged.current = true
      move(dx < 0 ? 1 : -1)
    }
  }

  return (
    <section className={`py-20 ${styles.section}`} aria-labelledby="articles-heading">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="section-tag mb-3">Советы и статьи</div>
            <h2 id="articles-heading" className="text-4xl font-bold text-cream">Полезное</h2>
          </div>
          <Link href="/poleznoe" className="btn-secondary px-5 py-2.5 text-sm whitespace-nowrap">
            Все статьи <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div role="region" tabIndex={-1} aria-roledescription="карусель" aria-label="Полезные статьи"
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              // The center article changes from a link to a side button after
              // navigation. Move focus to this stable region before that node
              // is replaced, so repeated arrow-key navigation keeps working.
              event.currentTarget.focus({ preventScroll: true })
              move(event.key === 'ArrowLeft' ? -1 : 1)
            }
          }}>
          <div className={styles.stage}
            onPointerDown={event => {
              if (event.button !== 0) return
              dragged.current = false
              pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
              setPaused(true)
            }}
            onPointerMove={event => {
              const start = pointer.current
              if (start && Math.abs(event.clientX - start.x) > 10 && Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)) {
                dragged.current = true
                if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId)
              }
            }}
            onPointerUp={finishDrag} onPointerCancel={() => { pointer.current = null }}
            onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false } }}>
            {articles.map((article, index) => {
              const offset = distance(index, active)
              const visible = Math.abs(offset) <= 2
              const content = <>
                {article.coverImage && <picture className={styles.picture}>
                  {article.imageAvif && <source srcSet={withBasePath(article.imageAvif)} type="image/avif" />}
                  <img src={withBasePath(article.coverImage)} alt={article.coverAlt || article.title}
                    width={article.imageWidth || 1600} height={article.imageHeight || 900}
                    loading="lazy" decoding="async" draggable={false}
                    style={{ objectPosition: articleCoverPositions[article.slug] || 'center' }} />
                </picture>}
                <div className={styles.caption}>
                  <span className={styles.meta}>{article.category}<span><Clock size={12} /> {article.readTime} мин</span></span>
                  {offset === 0 ? <h3 className={styles.title}>{article.title}</h3> : <span className={styles.title}>{article.title}</span>}
                  <span className={styles.read}>Читать статью <ArrowRight size={15} /></span>
                </div>
              </>
              return <div key={article.id} hidden={!visible} className={styles.card}
                data-offset={offset} style={{ '--offset': offset, '--depth': Math.abs(offset) } as CSSProperties}
                role="group" aria-roledescription="слайд" aria-label={`${index + 1} из ${count}`}>
                {offset === 0
                  ? <Link className={styles.cardAction} href={`/poleznoe/${article.slug}`} draggable={false}>{content}</Link>
                  : <button type="button" className={styles.cardAction} tabIndex={-1}
                    aria-label={`Показать статью: ${article.title}`}
                    onClick={() => { setPaused(true); setActive(index) }}>{content}</button>}
              </div>
            })}
          </div>
          <div className={styles.controls}>
            <button className={styles.control} type="button" aria-label="Предыдущая статья" onClick={() => move(-1)}><ArrowLeft size={20} /></button>
            <p className={styles.counter} aria-live={paused ? 'polite' : 'off'} aria-atomic="true"><strong>{String(active + 1).padStart(2, '0')}</strong><span> / {count}</span></p>
            <button className={styles.control} type="button" aria-label="Следующая статья" onClick={() => move(1)}><ArrowRight size={20} /></button>
            <button className={styles.control} type="button" disabled={reduced}
              aria-label={reduced ? 'Автопрокрутка отключена: уменьшение движения' : paused ? 'Включить автопрокрутку' : hovered || focused ? 'Автопрокрутка включена и возобновится после завершения взаимодействия' : 'Приостановить автопрокрутку'}
              aria-pressed={paused || reduced} onClick={() => setPaused(value => !value)}>
              {paused || reduced ? <Play size={18} /> : <Pause size={18} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
