import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { projects } from '@/data'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  const BASE = 'https://banger.su'
  const canonical = `${BASE}/nashi-raboty/${project.slug}`
  return {
    title: `${project.title} — наши работы | Бани Герасимов`,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: project.title,
      description: project.description,
      images: [{ url: project.image.startsWith('http') ? project.image : `${BASE}${project.image.replace('/NEW-SITE-BANI', '')}`, alt: project.title }],
    },
  }
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()

  return (
    <div className="pt-24 pb-20">
      <div className="site-container">
        <div className="flex items-center gap-2 text-sm text-cream/50 mb-8">
          <Link href="/" className="hover:text-cream transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/nashi-raboty" className="hover:text-cream transition-colors">Наши работы</Link>
          <span>/</span>
          <span className="text-cream">{project.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-4">
              <Image src={project.image} alt={project.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
            </div>
            {project.images.slice(1).map((img, i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <Image src={img} alt={`${project.title} - фото ${i + 2}`} fill className="object-cover" sizes="66vw" />
              </div>
            ))}
          </div>

          <div>
            <div className="glass rounded-3xl p-6 mb-5">
              <div className="text-xs text-gold-400/80 font-semibold tracking-widest uppercase mb-3">Проект</div>
              <h1 className="text-2xl font-bold text-cream mb-5">{project.title}</h1>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-cream/50 w-24">Модель</span>
                  <span className="text-cream font-medium">{project.model}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-cream">{project.region}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-cream">{project.date}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 glass rounded-xl text-xs text-cream/60">{tag}</span>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h2 className="text-lg font-bold text-cream mb-3">Описание</h2>
              <p className="text-sm text-cream/70 leading-relaxed">{project.description}</p>
            </div>
          </div>
        </div>

        <CTAFormInline modelName={project.model} />
      </div>
    </div>
  )
}
