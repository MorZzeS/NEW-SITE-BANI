import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { allProjects, findProject } from '@/data/projects'
import { baseEquipmentRows } from '@/data/equipment'
import { InteractivePhotoGallery } from '@/components/ui/InteractivePhotoGallery'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import { withBasePath } from '@/lib/site-path'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return allProjects.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)
  if (!project) return {}
  const canonical = `https://banger.su/nashi-raboty/${project.slug}`
  const description = project.caseType === 'client-case' ? project.description : `${project.title}. ${project.description}`
  return {
    title: project.pageHeading || project.title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title: project.pageHeading || project.title, description, images: [{ url: `https://banger.su${project.image}`, alt: project.cover.alt }] },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = findProject(slug)
  if (!project) notFound()
  const clientCase = project.caseType === 'client-case' && project.clientCase
  const coverGallery = [project.cover, ...project.gallery.filter(item => item.kind === project.cover.kind)]

  return (
    <div className="project-page pt-24 pb-20">
      <div className="site-container">
        <nav className="project-breadcrumbs mb-6 flex flex-wrap items-center gap-2 text-sm text-cream/50" aria-label="Хлебные крошки">
          <a href={withBasePath('/')} className="hover:text-cream transition-colors">Главная</a><span>/</span>
          <Link href="/nashi-raboty" className="hover:text-cream transition-colors">Наши работы</Link><span>/</span>
          <span className="text-cream">{project.title}</span>
        </nav>

        <header className="project-page-heading">
          <div className="section-tag mb-3">{clientCase ? (project.executionConfirmed ? 'Клиентский объект' : 'Клиентский проект') : project.caseType === 'showroom-example' ? 'Выставочный образец' : project.caseType === 'photo-example' ? 'Вариант исполнения' : 'Каталожная визуализация'}</div>
          <h1 className="mb-4 text-3xl font-extrabold text-cream sm:text-4xl">{project.pageHeading || project.title}</h1>
          <p className="project-intro">{project.description}</p>
        </header>

        <div className={clientCase || project.caseType !== 'showroom-example' ? "project-story-grid" : "project-showroom-photo"}>
          <div className="project-cover-gallery">
            <InteractivePhotoGallery photos={coverGallery} featured ariaLabel={`Обложка проекта: ${project.title}`} />
          </div>

          {clientCase ? (
            <section className="project-case-summary" aria-labelledby="client-case-summary">
              <h2 id="client-case-summary">{project.executionConfirmed ? 'Кратко об объекте' : 'Кратко о проекте'}</h2>
              <dl className="project-case-facts">
                {clientCase.size && <div><dt>Размер</dt><dd>{clientCase.size}</dd></div>}
                {clientCase.base && <div><dt>Комплектация</dt><dd>{clientCase.base}</dd></div>}
                {clientCase.duration && <div><dt>Эксплуатация</dt><dd>{clientCase.duration}</dd></div>}
              </dl>
              {clientCase.ownerFeedback && <p className="mt-4 text-sm leading-relaxed text-cream/75">{clientCase.ownerFeedback}</p>}
            </section>
          ) : project.caseType !== 'showroom-example' ? (
            <section className="project-case-summary" aria-labelledby="project-note-title">
              <h2 id="project-note-title">О фотографии</h2>
              <p className="m-0 text-sm leading-relaxed text-cream/70">{project.temporaryNote || (project.evidence === 'illustrative' ? 'Каталожная визуализация. Сведения о подтверждённом объекте ожидают уточнения.' : project.cover.caption)}</p>
              {project.model && <p className="mt-4 text-sm text-cream/60">Модель: {project.model}</p>}
              {project.characteristics.length > 0 && <ul className="mt-4 space-y-2 text-sm text-cream/70">{project.characteristics.map(item => <li key={item.label}>{item.label}: {item.value}</li>)}</ul>}
            </section>
          ) : null}
        </div>

        {clientCase && (
          <>
            {clientCase.selectedExtras.length > 0 && <section className="project-extras" aria-labelledby="project-extras-title">
              <div className="project-extras-heading">
                <h2 className="project-section-title" id="project-extras-title">{project.executionConfirmed ? 'Дополнительная комплектация объекта' : 'Дополнительные решения проекта'}</h2>
                <p className="mb-4 text-sm text-cream/60">{project.executionConfirmed ? 'Эти решения были заказаны и выполнены при изготовлении бани.' : 'Ниже перечислены индивидуальные решения, предусмотренные проектной спецификацией. Их состав сверяется по финальной комплектации.'}</p>
              </div>
              <div className="project-extras-grid">
                {clientCase.selectedExtras.map(extra => (
                  <article className="project-extra" key={extra}>
                    <h3 className="project-extra-name">{extra}</h3>
                  </article>
                ))}
              </div>
            </section>}

            {clientCase.gifts?.length ? <section className="project-gifts" aria-labelledby="project-gifts-title">
              <h2 className="project-section-title" id="project-gifts-title">Подарочные позиции в комплектации</h2>
              <ul>{clientCase.gifts.map(gift => <li key={gift}>{gift}</li>)}</ul>
            </section> : null}

            {project.showBaseEquipment && <section className="project-base" aria-labelledby="project-base-title">
              <h2 className="project-section-title" id="project-base-title">Что входит в базовую комплектацию</h2>
              <p className="mb-4 text-sm text-cream/60">Ниже показана базовая комплектация, на основе которой изготовлена баня. Дополнительное оборудование, установленное на этой бане, вынесено в отдельный список выше.</p>
              <table className="base-equipment-table"><caption className="sr-only">Состав базовой комплектации мобильных бань</caption><tbody>{baseEquipmentRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td><span>{row.value}</span>{row.gift && <small className="base-equipment-gift">В подарок</small>}</td></tr>)}</tbody></table>
            </section>}
          </>
        )}

        {project.storySections?.length ? <section className="project-story-sections" aria-label="История и решения проекта">
          {project.storySections.map((section, index) => <article className="project-story-section" key={`${section.heading}-${index}`}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            {section.bullets?.length ? <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}
          </article>)}
        </section> : null}

        {project.specificationGroups?.length ? <section className="project-specifications" aria-label="Подтверждённые особенности исполнения">
          {project.specificationGroups.map(group => <article className="project-specification-group" key={group.heading}>
            <h2>{group.heading}</h2>
            <dl>{group.items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
          </article>)}
        </section> : null}

        {project.review ? <aside className="project-review" aria-label="Отзыв клиента">
          <span className="section-tag">Обратная связь</span>
          <blockquote>«{project.review.quote}»</blockquote>
          <a href={project.review.url} target="_blank" rel="noopener noreferrer">{project.review.sourceLabel} ↗</a>
        </aside> : null}

        {(() => {
          const photos = project.gallery.filter(item => item.kind === 'photo')
          const renders = project.gallery.filter(item => item.kind === 'catalog-render')
          const plans = project.gallery.filter(item => item.kind === 'plan')
          const references = project.gallery.filter(item => item.kind === 'reference')
          return <>
            {photos.length ? <section className="project-photo-gallery" aria-labelledby="project-gallery-title">
              <h2 className="project-section-title" id="project-gallery-title">{project.caseType === 'client-case' ? 'Фотографии объекта' : 'Фотографии образца'}</h2>
              <InteractivePhotoGallery photos={photos} ariaLabel={`Фотогалерея: ${project.title}`} />
            </section> : null}
            {renders.length ? <section className="project-photo-gallery project-render-gallery" aria-labelledby="project-renders-title">
              <h2 className="project-section-title" id="project-renders-title">Первоначальный проект и визуализация</h2>
              <p className="project-media-note">Проектная визуализация. Фактическое исполнение может отличаться от первоначального рендера в соответствии с согласованной комплектацией.</p>
              <InteractivePhotoGallery photos={renders} ariaLabel={`Проектные визуализации: ${project.title}`} />
            </section> : null}
            {plans.length ? <section className="project-photo-gallery project-plan-gallery" aria-labelledby="project-plans-title">
              <h2 className="project-section-title" id="project-plans-title">Планировка</h2>
              <InteractivePhotoGallery photos={plans} ariaLabel={`Планировки: ${project.title}`} />
            </section> : null}
            {references.length ? <section className="project-photo-gallery project-reference-gallery" aria-labelledby="project-references-title">
              <h2 className="project-section-title" id="project-references-title">Материалы проекта</h2>
              <p className="project-media-note">Референс интерьера из материалов проекта.</p>
              <InteractivePhotoGallery photos={references} ariaLabel={`Материалы проекта: ${project.title}`} />
            </section> : null}
          </>
        })()}

        {project.videos?.length ? <section className="project-video-gallery" aria-labelledby="project-video-title">
          <h2 className="project-section-title" id="project-video-title">Видео проекта</h2>
          <div className={`project-video-grid${project.videos.length === 1 ? ' project-video-grid--single' : project.videos.length === 3 ? ' project-video-grid--triple' : ''}`}>{project.videos.map(video => <figure key={video.id} className="project-video">
            <video controls muted playsInline preload="none" poster={withBasePath(video.poster)} aria-label={video.alt}>
              <source src={withBasePath(video.src)} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
            <figcaption>{video.caption} <span>Без звука</span></figcaption>
          </figure>)}</div>
        </section> : null}

        <div className="project-inquiry"><CTAFormInline modelName={project.model || project.title} /></div>
      </div>
    </div>
  )
}
