import Image from 'next/image'
import Link from 'next/link'
import { projects, projectMediaStyle } from '@/data/projects'

export function RealWorksGallery({ limit = 2 }: { limit?: number }) {
  return (
    <div className="real-works-grid portfolio-project-grid">
      {projects.slice(0, limit).map(project => (
        <Link key={project.id} href={`/nashi-raboty/${project.slug}`} className="real-works-card portfolio-project-card glass-card">
          <span className="real-works-image">
            <Image
              src={project.cover.thumbnail}
              alt={project.cover.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 50vw, 100vw"
              style={projectMediaStyle(project.cover)}
            />
            <span className="real-works-open" aria-hidden="true">Подробнее ↗</span>
          </span>
          <span className="portfolio-project-copy">
            <span className="portfolio-project-label">{project.caseType === 'client-case' ? 'Клиентский объект' : 'Временный пример'}</span>
            <strong className="real-works-caption">{project.title}</strong>
            <span className="portfolio-project-description">{project.cardDescription}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
