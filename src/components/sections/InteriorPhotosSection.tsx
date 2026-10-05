'use client'
import Image from 'next/image'
import Link from 'next/link'

const PHOTOS = [
  {
    src: '/NEW-SITE-BANI/images/interiors/parnaya-.jpg',
    alt: 'Парная с многоуровневыми полками — реальное фото',
    caption: 'Парная',
  },
  {
    src: '/NEW-SITE-BANI/images/interiors/pech-.jpg',
    alt: 'Печная зона с ограждением — реальное фото',
    caption: 'Печная зона',
  },
  {
    src: '/NEW-SITE-BANI/images/interiors/pomiv-.jpg',
    alt: 'Моечная с душем — реальное фото',
    caption: 'Моечная',
  },
  {
    src: '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-1.jpg',
    alt: 'Комната отдыха — реальное фото',
    caption: 'Комната отдыха',
  },
  {
    src: '/NEW-SITE-BANI/images/interiors/boyler-50-.jpg',
    alt: 'Бойлер и водоснабжение — реальное фото',
    caption: 'Водоснабжение',
  },
  {
    src: '/NEW-SITE-BANI/images/interiors/parnaya-2-.jpg',
    alt: 'Парная с декоративной подсветкой — реальное фото',
    caption: 'Подсветка парной',
  },
]

export function InteriorPhotosSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="section-tag text-xs px-3 py-1.5 mb-3 inline-block">
              Реальные фото
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-cream leading-tight">
              Как выглядит<br className="hidden sm:block" /> наша баня внутри
            </h2>
            <p className="mt-3 text-cream/60 text-base max-w-xl">
              Собственные фотографии реализованных объектов — парная, моечная, комната отдыха,
              водоснабжение и отделка.
            </p>
          </div>
          <Link
            href="/katalog/bani"
            className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap self-start sm:self-auto"
          >
            Смотреть каталог
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-xs font-semibold text-white/90 tracking-wide">
                  {photo.caption}
                </span>
              </div>
              {/* Static badge */}
              <div className="absolute top-2 left-2">
                <span className="text-[10px] font-medium bg-black/60 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Реальное фото
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs text-cream/40">
          Варианты исполнения интерьера — конкретная комплектация согласуется при заказе
        </p>
      </div>
    </section>
  )
}
