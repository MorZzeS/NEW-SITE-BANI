'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { catalogCardImage } from '@/lib/catalog-image'
import styles from './CatalogCard.module.css'

type Props = {
  image: string
  images: string[]
  name: string
  size: string
  href: string
  bestSeller?: boolean
}

export function CatalogCardGallery({ image, images, name, size, href, bestSeller = false }: Props) {
  const slides = Array.from(new Set([image, ...images].filter(Boolean)))
  const [active, setActive] = useState(0)
  const current = slides[active] || image

  return <div className={styles.gallery} role="region" aria-roledescription="карусель фотографий" aria-label={`Фотографии: ${name}`}>
    <Link href={href} className={styles.galleryPhoto} aria-label={`${name}, ${active + 1} из ${slides.length}. Открыть модель`}>
      <picture className="absolute inset-0 block">
        <source type="image/avif" srcSet={catalogCardImage(current, 'avif')} />
        <Image src={catalogCardImage(current)} alt={name} fill loading="lazy" quality={85} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" className={styles.galleryImage} />
      </picture>
    </Link>
    <div className={styles.badges} aria-label="Размер и отметки модели">
      <span className={styles.sizeBadge}>{size}</span>
      {bestSeller && <span className={styles.bestSeller}>Хит продаж</span>}
    </div>
    {slides.length > 1 && <>
      <button type="button" className={`${styles.galleryControl} ${styles.galleryPrevious}`} aria-label={`Предыдущее фото ${name}`} onClick={() => setActive(index => (index - 1 + slides.length) % slides.length)}>
        <ChevronLeft aria-hidden="true" size={19} />
      </button>
      <button type="button" className={`${styles.galleryControl} ${styles.galleryNext}`} aria-label={`Следующее фото ${name}`} onClick={() => setActive(index => (index + 1) % slides.length)}>
        <ChevronRight aria-hidden="true" size={19} />
      </button>
      <span className={styles.galleryCounter} aria-live="polite" aria-atomic="true">{active + 1} / {slides.length}</span>
    </>}
  </div>
}
