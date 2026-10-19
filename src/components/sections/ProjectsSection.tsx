import Link from 'next/link'
import { RealWorksGallery } from './RealWorksGallery'
export function ProjectsSection() {
  return <section className="py-20" aria-labelledby="projects-heading"><div className="site-container"><div className="mb-10 max-w-2xl"><div className="section-tag mb-3">Клиентский объект и выставочный образец</div><h2 id="projects-heading" className="text-4xl font-bold text-cream mb-4">Наши работы</h2><p className="text-cream/70">Две истории с подробностями и фотографиями. Временная карточка выставочного образца будет заменена после подготовки нового объекта.</p></div><RealWorksGallery limit={2} /><div className="mt-8"><Link href="/nashi-raboty" className="btn-secondary px-6 py-3">Все объекты →</Link></div></div></section>
}
