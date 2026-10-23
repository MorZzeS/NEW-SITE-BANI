import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { allProjects, findProject, projectMediaStyle } from '@/data/projects'
import { baseEquipmentRows } from '@/data/equipment'
import { InteractivePhotoGallery } from '@/components/ui/InteractivePhotoGallery'
import { CTAFormInline } from '@/components/forms/CTAFormInline'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return allProjects.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)
  if (!project) return {}
  const canonical = `https://banger.su/nashi-raboty/${project.slug}`
  return {
    title: project.pageHeading || project.title,
    description: project.description,
    alternates: { canonical },
    openGraph: { url: canonical, title: project.pageHeading || project.title, description: project.description, images: [{ url: `https://banger.su${project.image}`, alt: project.cover.alt }] },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = findProject(slug)
  if (!project) notFound()
  const clientCase = project.caseType === 'client-case' && project.clientCase

  return (
    <div className="pt-24 pb-20">
      <div className="site-container">
        <nav className="mb-6 flex items-center gap-2 text-sm text-cream/50" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-cream transition-colors">Главная</Link><span>/</span>
          <Link href="/nashi-raboty" className="hover:text-cream transition-colors">Наши работы</Link><span>/</span>
          <span className="text-cream">{project.title}</span>
        </nav>

        <header className="mb-7 max-w-4xl">
          <div className="section-tag mb-3">{clientCase ? 'Клиентский объект' : project.caseType === 'showroom-example' ? 'Временный выставочный пример' : 'Каталожная визуализация'}</div>
          <h1 className="mb-4 text-3xl font-extrabold text-cream sm:text-4xl">{project.pageHeading || project.title}</h1>
          <p className="project-intro">{project.description}</p>
        </header>

        <div className="project-story-grid">
          <figure className="m-0">
            <div className="relative aspect-video overflow-hidden rounded-3xl">
              <Image src={project.image} alt={project.cover.alt} style={projectMediaStyle(project.cover)} fill priority className="object-cover" sizes="(max-width: 760px) 100vw, 66vw" />
            </div>
            <figcaption className="mt-2 text-sm text-cream/55">{project.cover.caption}</figcaption>
          </figure>

          {clientCase ? (
            <section className="project-case-summary" aria-labelledby="client-case-summary">
              <h2 id="client-case-summary">Кратко об объекте</h2>
              <dl className="project-case-facts">
                <div><dt>Размер</dt><dd>{clientCase.size}</dd></div>
                <div><dt>Комплектация</dt><dd>{clientCase.base}</dd></div>
                <div><dt>Эксплуатация</dt><dd>{clientCase.duration}</dd></div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-cream/75">{clientCase.ownerFeedback}</p>
            </section>
          ) : (
            <section className="project-case-summary" aria-labelledby="project-note-title">
              <h2 id="project-note-title">О фотографии</h2>
              <p className="m-0 text-sm leading-relaxed text-cream/70">{project.temporaryNote || (project.evidence === 'illustrative' ? 'Каталожная визуализация. Сведения о подтверждённом объекте ожидают уточнения.' : project.cover.caption)}</p>
              {project.model && <p className="mt-4 text-sm text-cream/60">Модель: {project.model}</p>}
              {project.characteristics.length > 0 && <ul className="mt-4 space-y-2 text-sm text-cream/70">{project.characteristics.map(item => <li key={item.label}>{item.label}: {item.value}</li>)}</ul>}
            </section>
          )}
        </div>

        {clientCase && (
          <>
            <section className="project-extras" aria-label="Дополнительно выбранные опции">
              {clientCase.selectedExtras.map(extra => <article className="project-extra" key={extra}><h2>{extra}</h2><p>Установлено дополнительно к базовой комплектации.</p></article>)}
            </section>

            <section className="project-base" aria-labelledby="project-base-title">
              <h2 className="project-section-title" id="project-base-title">Что входит в базовую комплектацию</h2>
              <p className="mb-4 text-sm text-cream/60">Состав показывается из актуальных данных раздела комплектации. Для этой бани подтверждена базовая комплектация.</p>
              <table className="base-equipment-table"><caption className="sr-only">Состав базовой комплектации</caption><thead><tr><th scope="col">Параметр</th><th scope="col">Состав</th></tr></thead><tbody>{baseEquipmentRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table>
            </section>
          </>
        )}

        <section className="project-photo-gallery" aria-labelledby="project-gallery-title">
          <h2 className="project-section-title" id="project-gallery-title">{clientCase ? 'Фотографии объекта' : 'Фотография'}</h2>
          {clientCase && <p className="mb-4 text-sm text-cream/60">11 фотографий, расположенных в исходной нумерации от 1 до 11.</p>}
          <InteractivePhotoGallery photos={project.media} ariaLabel={`Фотогалерея: ${project.title}`} />
        </section>

        {clientCase && <CTAFormInline modelName="Баня 8 × 2,4 м" />}
      </div>
    </div>
  )
}
