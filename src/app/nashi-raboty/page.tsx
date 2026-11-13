import { defaultOpenGraph } from '@/lib/site-metadata'
import { RealWorksGallery } from '@/components/sections/RealWorksGallery'
import { projects } from '@/data/projects'
const title = 'Наши работы — реальные проекты бань и мобильных домов'
const description = 'Реальные проекты мобильных бань и домов: индивидуальные планировки, материалы, отделка и детали исполнения.'
export const metadata = { title, description, alternates: { canonical: 'https://banger.su/nashi-raboty' } ,
  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/nashi-raboty', title, description },
}
export default function NashiRabotyPage() {
  const clientProjects = projects.filter(project => project.caseType === 'client-case')
  const showrooms = projects.filter(project => project.caseType === 'showroom-example')
  return <div className="pt-28 pb-20"><div className="site-container"><div className="works-page-heading mb-14"><div className="section-tag mb-4">Бани и дома BANGER</div><h1 className="text-4xl sm:text-5xl font-extrabold text-cream mb-3">Наши работы</h1><p className="text-cream/70 max-w-2xl">Реальные проекты, индивидуальные решения и бани, созданные для наших клиентов.</p></div>
    {clientProjects.length > 0 && <section className="works-portfolio-section" aria-labelledby="works-client-projects"><div className="works-portfolio-section-heading"><div><span className="section-tag">Проекты заказчиков</span><h2 id="works-client-projects">Индивидуальные решения</h2></div><p>Согласованные планировки, отделки и комплектации клиентских проектов.</p></div><RealWorksGallery projects={clientProjects} /></section>}
    {showrooms.length > 0 && <section className="works-portfolio-section works-showroom-section" aria-labelledby="works-showroom-projects"><div className="works-portfolio-section-heading"><div><span className="section-tag">На выставке</span><h2 id="works-showroom-projects">Выставочные образцы</h2></div><p>Демонстрационные проекты показывают варианты внешней отделки и внутреннего исполнения.</p></div><RealWorksGallery projects={showrooms} /></section>}
  </div></div>
}
