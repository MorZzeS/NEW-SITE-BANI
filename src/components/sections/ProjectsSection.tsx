import Link from 'next/link'
import { RealWorksGallery } from './RealWorksGallery'
import { projects } from '@/data/projects'

const homepageProjects = [
  'skandinaviya-premium-individualnyy-proekt-6x26',
  'banya-8x24-u-klienta',
].map(slug => {
  const project = projects.find(item => item.slug === slug)
  if (!project) throw new Error(`Homepage portfolio project is missing: ${slug}`)
  return project
})
export function ProjectsSection() {
  return <section className="py-20" aria-labelledby="projects-heading"><div className="site-container"><div className="mb-10 max-w-2xl"><div className="section-tag mb-3">Бани BANGER</div><h2 id="projects-heading" className="text-4xl font-bold text-cream mb-4">Наши работы</h2><p className="text-cream/70">Архитектура, интерьеры и детали наших бань в фотографиях.</p></div><RealWorksGallery projects={homepageProjects} /><div className="mt-8"><Link href="/nashi-raboty" className="btn-secondary px-6 py-3">Все объекты →</Link></div></div></section>
}
