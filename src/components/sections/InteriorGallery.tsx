import Image from 'next/image'

const interiors = [
  '/NEW-SITE-BANI/images/interiors/parnaya-2-.jpg',
  '/NEW-SITE-BANI/images/interiors/parnaya-3-.jpg',
  '/NEW-SITE-BANI/images/interiors/parnaya-4-.jpg',
  '/NEW-SITE-BANI/images/interiors/parnaya-5-.jpg',
  '/NEW-SITE-BANI/images/interiors/parnaya-6-.jpg',
  '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-1.jpg',
  '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-3.jpg',
  '/NEW-SITE-BANI/images/interiors/boyler-50-.jpg',
  '/NEW-SITE-BANI/images/interiors/dushevoy-plus-.jpg',
  '/NEW-SITE-BANI/images/interiors/pech-2.jpg',
  '/NEW-SITE-BANI/images/interiors/pomiv-2.jpg',
  '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-5.jpg',
  '/NEW-SITE-BANI/images/interiors/v2/image1.jpg',
  '/NEW-SITE-BANI/images/interiors/v2/image6.jpg',
  '/NEW-SITE-BANI/images/interiors/v2/image14.jpg',
]

export function InteriorGallery() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="text-center mb-12">
          <div className="section-tag mb-4">Галерея интерьеров</div>
          <h2 className="text-4xl font-bold text-cream mb-3">Примеры интерьеров наших бань</h2>
          <p className="text-cream/60 max-w-lg mx-auto">Реальные фото с наших объектов и производственного цеха. Без привязки к конкретной модели.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {interiors.map((src, i) => (
            <a key={i} href="#" className="group block relative aspect-[4/3] rounded-3xl overflow-hidden glass-card">
              <Image src={src} alt={`Интерьер бани ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/60 via-transparent to-transparent" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
