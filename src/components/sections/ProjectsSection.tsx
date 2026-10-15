import Link from 'next/link'
import { RealWorksGallery } from './RealWorksGallery'
export function ProjectsSection() {
  return <section className="py-20" aria-labelledby="projects-heading"><div className="site-container"><div className="mb-10 max-w-2xl"><div className="section-tag mb-3">Портфолио производства</div><h2 id="projects-heading" className="text-4xl font-bold text-cream mb-4">Наши работы</h2><p className="text-cream/70">Фотографии наших работ: детали, интерьеры и внешний вид.</p></div><RealWorksGallery limit={6} /><div className="mt-8"><Link href="/nashi-raboty" className="btn-secondary px-6 py-3">Все фотографии →</Link></div></div></section>
}
