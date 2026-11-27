'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { catalogCardImage } from '@/lib/catalog-image'
import { ModelViewCount } from './ModelViewCount'
import { approvedColorVariantsFor } from '@/data/catalog-color-variants'
import { withBasePath } from '@/lib/site-path'
import styles from './CatalogCard.module.css'

type Props = {
  image: string
  images: string[]
  name: string
  size: string
  href: string
  bestSeller?: boolean
  modelId?: string
}

export function CatalogCardGallery({ image, images, name, size, href, bestSeller = false, modelId }: Props) {
  const slides = Array.from(new Set([image, ...images].filter(Boolean)))
  const [active, setActive] = useState(0)
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null)
  const [zoomOpen, setZoomOpen] = useState(false)
  const colorVariants = modelId ? approvedColorVariantsFor(modelId) : []
  const selectedColor = colorVariants.find(variant => variant.colorCode === selectedColorCode)
  const current = selectedColor?.src ?? slides[active] ?? image
  const standardCardImage = !selectedColor && /\/model\.(?:png|jpe?g)$/i.test(current)

  useEffect(() => {
    if (!zoomOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoomOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [zoomOpen])

  return <div className={styles.gallery} role="region" aria-roledescription="карусель фотографий" aria-label={`Фотографии: ${name}`}>
    <Link href={href} className={styles.galleryPhoto} aria-label={`${name}, ${active + 1} из ${slides.length}. Открыть модель`}>
      <picture className="absolute inset-0 block">
        {standardCardImage && <source type="image/avif" srcSet={catalogCardImage(current, 'avif')} />}
        <Image src={catalogCardImage(current)} alt={selectedColor ? `${name}, цвет ${selectedColor.colorName}` : name} fill loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" className={styles.galleryImage} />
      </picture>
    </Link>
    <div className={styles.badges} aria-label="Размер и отметки модели">
      <span className={styles.sizeBadge}>{size}</span>
      {bestSeller && <span className={styles.bestSeller}>Хит продаж</span>}
      {modelId && <ModelViewCount modelId={modelId} />}
    </div>
    {slides.length > 1 && !selectedColor && <>
      <button type="button" className={`${styles.galleryControl} ${styles.galleryPrevious}`} aria-label={`Предыдущее фото ${name}`} onClick={() => setActive(index => (index - 1 + slides.length) % slides.length)}>
        <ChevronLeft aria-hidden="true" size={19} />
      </button>
      <button type="button" className={`${styles.galleryControl} ${styles.galleryNext}`} aria-label={`Следующее фото ${name}`} onClick={() => setActive(index => (index + 1) % slides.length)}>
        <ChevronRight aria-hidden="true" size={19} />
      </button>
      <span className={styles.galleryCounter} aria-live="polite" aria-atomic="true">{active + 1} / {slides.length}</span>
    </>}
    {selectedColor && <button type="button" className={styles.colorZoom} aria-label={`Увеличить вариант «${selectedColor.colorName}»`} onClick={() => setZoomOpen(true)}><Maximize2 aria-hidden="true" size={16} /></button>}
    {colorVariants.length > 0 && <div className={styles.colorPreview} aria-label="Цветовые варианты модели">
      <span className={styles.colorReviewLabel}>Цвет на выбор</span>
      <div className={styles.colorSwatches}>
        <button type="button" className={styles.colorReset} aria-pressed={!selectedColor} onClick={() => { setSelectedColorCode(null); setActive(0) }}>Фото модели</button>
        {colorVariants.map(variant => <button key={variant.colorCode} type="button" className={styles.colorSwatch} data-selected={selectedColorCode === variant.colorCode} aria-label={`${variant.colorName}`} aria-pressed={selectedColorCode === variant.colorCode} title={variant.colorName} onClick={() => setSelectedColorCode(variant.colorCode)}>
          <Image src={withBasePath(variant.src)} alt="" width={34} height={24} sizes="34px" />
        </button>)}
      </div>
    </div>}
    {zoomOpen && selectedColor && typeof document !== 'undefined' && createPortal(<div className={styles.zoomBackdrop} role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setZoomOpen(false) }}>
      <section className={styles.zoomDialog} role="dialog" aria-modal="true" aria-label={`${name}, цвет ${selectedColor.colorName}`}>
        <button type="button" className={styles.zoomClose} aria-label="Закрыть увеличенное изображение" onClick={() => setZoomOpen(false)}><X aria-hidden="true" size={20} /></button>
        <Image src={withBasePath(selectedColor.src)} alt={`${name}, вариант «${selectedColor.colorName}»`} width={selectedColor.width} height={selectedColor.height} sizes="94vw" className={styles.zoomImage} />
        <p>{selectedColor.colorName}</p>
      </section>
    </div>, document.body)}
  </div>
}
