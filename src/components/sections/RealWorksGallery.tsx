import Image from 'next/image'
import Link from 'next/link'
import { projects as allVisibleProjects, projectMediaStyle, type PreparedPortfolioRecord } from '@/data/projects'
import { withBasePath } from '@/lib/site-path'

export function RealWorksGallery({ limit, projects = allVisibleProjects }: { limit?: number; projects?: PreparedPortfolioRecord[] }) {
  const displayedProjects = limit === undefined ? projects : projects.slice(0, limit)
  return (
    <div className={`real-works-grid portfolio-project-grid${displayedProjects.length === 1 ? ' portfolio-project-grid--single' : ''}`}>
      {displayedProjects.map(project => (
        <Link key={project.id} href={`/nashi-raboty/${project.slug}`} className="real-works-card portfolio-project-card glass-card">
          <span className="real-works-image">
            <Image
              src={withBasePath(project.cover.thumbnail)}
              alt={project.cover.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1280px) 600px, (min-width: 560px) 50vw, 100vw"
              style={projectMediaStyle(project.cover)}
            />
            <span className="real-works-open" aria-hidden="true">Подробнее ↗</span>
          </span>
          <span className="portfolio-project-copy">
            <span className="portfolio-project-label">{project.projectCategory === 'mobile-home' ? 'Мобильный дом · выставочный образец' : project.caseType === 'client-case' ? 'Клиентский проект' : project.caseType === 'photo-example' ? 'Вариант исполнения' : 'Выставочный образец'}</span>
            <strong className="real-works-caption">{project.title}</strong>
            <span className="portfolio-project-description">{project.cardDescription}</span>
            {project.clientCase?.selectedExtras?.length ? <span className="portfolio-project-tags" aria-label="Особенности проекта">{project.clientCase.selectedExtras.slice(0, 3).map(extra => <span key={extra}>{extra}</span>)}</span> : null}
          </span>
        </Link>
      ))}
    </div>
  )
}
