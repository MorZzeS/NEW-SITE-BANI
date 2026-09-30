import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { projects } from '@/data'

export const metadata = {
  title: 'Наши работы — реализованные проекты',
  description: 'Реальные объекты. Фото и видео установленных мобильных бань и домов по всей России.',
}

export default function NashiRabotyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Наши работы</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Реализованные проекты</h1>
          <p className="text-cream/60 max-w-lg">
            Реальные объекты, реальные фото. Более 500 бань и домов установлено по всей России.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link href={`/nashi-raboty/${project.slug}`} key={project.id} className="group block">
              <div className="glass-card overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-4 text-xs text-cream/70">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.region}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.date}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-gold-400/80 font-semibold mb-2">{project.model}</div>
                  <h2 className="text-lg font-bold text-cream mb-2 group-hover:text-gold-300 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-cream/60 leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 glass rounded-xl text-xs text-cream/60">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
