import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { articles, homes } from '@/data'
import { articleHtmlWithBasePath, withBasePath } from '@/lib/site-path'
import { articleAliases } from '@/data/article-aliases'
import type { Metadata } from 'next'
import { articleInlineVisuals } from '@/data/article-visuals'

function contentWithVisuals(slug: string, content: string) {
  for (const visual of articleInlineVisuals[slug] || []) {
    const figure = `<figure><picture><source srcset="${withBasePath(visual.avif)}" type="image/avif" /><img src="${withBasePath(visual.src)}" alt="${visual.alt}" width="${visual.width}" height="${visual.height}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;border-radius:16px" /></picture><figcaption>${visual.caption}</figcaption></figure>`
    content = content.replace(`<h2 id="${visual.beforeSection}">`, `${figure}<h2 id="${visual.beforeSection}">`)
  }
  return content
}

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return [...articles.map((a) => ({ slug: a.slug })), ...Object.keys(articleAliases).map((slug) => ({ slug }))]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === (articleAliases[params.slug] || params.slug))
  if (!article) return {}
  const canonical = `https://banger.su/poleznoe/${article.slug}`
  return {
    title: { absolute: article.seoTitle || article.title },
    description: article.metaDescription || article.excerpt,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: article.title,
      description: article.metaDescription || article.excerpt,
      siteName: 'Бани Герасимов',
      type: 'article',
      images: article.coverImage ? [{ url: `https://banger.su${article.coverImage}`, width: article.imageWidth || 1600, height: article.imageHeight || 900, alt: article.coverAlt || article.title }] : [],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.metaDescription || article.excerpt, images: article.coverImage ? [`https://banger.su${article.coverImage}`] : [] },
  }
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === (articleAliases[params.slug] || params.slug))
  if (!article) notFound()

  if (articleAliases[params.slug]) return <div className="site-container pt-32 pb-20"><h1 className="text-3xl font-bold text-cream mb-6">Материал обновлён</h1><p className="text-cream/70 mb-6">Актуальная статья доступна по новому адресу.</p><Link href={`/poleznoe/${article.slug}`} className="btn-primary">{article.title}</Link></div>

  const heroImage = article.image || article.coverImage
  const related = (article.relatedSlugs || []).map((slug) => articles.find((a) => a.slug === slug)).filter((a): a is NonNullable<typeof a> => Boolean(a))

  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-cream/50 mb-8">
          <Link href="/" className="hover:text-cream transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/poleznoe" className="hover:text-cream transition-colors">Полезное</Link>
          <span>/</span>
          <span className="text-cream line-clamp-1">{article.title}</span>
        </div>

        {/* Article */}
        <div className="prose-column">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-tag text-xs px-3 py-1.5">{article.category}</span>
            <span className="flex items-center gap-1.5 text-sm text-cream/40">
              <Clock className="w-4 h-4" /> {article.readTime} минут чтения
            </span>

          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-cream mb-6 leading-tight break-words">{article.title}</h1>

          <p className="text-xl text-cream/70 leading-relaxed mb-8 font-medium">{article.excerpt}</p>

          {heroImage && <figure className="mb-8">
            <picture>
              {article.imageAvif && <source srcSet={withBasePath(article.imageAvif)} type="image/avif" />}
              <img src={withBasePath(heroImage)} alt={article.imageAlt || article.coverAlt || article.title} width={article.imageWidth || (article.image ? 1440 : 1600)} height={article.imageHeight || (article.image ? 810 : 900)} fetchPriority="high" className="w-full h-auto rounded-3xl" />
            </picture>
            {article.imageCaption && <figcaption className="text-sm text-cream/60 mt-3">{article.imageCaption}</figcaption>}
          </figure>}

          {article.toc && <nav aria-label="Содержание статьи" className="glass rounded-3xl p-5 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-cream mb-4">Содержание</h2>
            <ol className="space-y-2 text-cream/70">
              {article.toc.map((item) => <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                <a href={`#${item.id}`} className="hover:text-gold-300 underline underline-offset-4">{item.title}</a>
              </li>)}
            </ol>
          </nav>}
          <article className="article-body glass rounded-3xl p-5 sm:p-8 text-cream/80"
            dangerouslySetInnerHTML={{ __html: articleHtmlWithBasePath(contentWithVisuals(article.slug, article.content), homes.map((home) => home.slug)) }} />
          {article.photoBrief && !heroImage && <section aria-label="Место для иллюстраций" className="glass rounded-3xl p-5 sm:p-8 mt-8 border border-dashed border-cream/20">
            <h2 className="text-xl font-bold text-cream mb-3">Иллюстрации к материалу</h2>
            <p className="text-cream/70 leading-relaxed">{article.photoBrief}</p>
            <p className="text-sm text-cream/50 mt-3">Фотографии и схемы будут добавлены после подтверждения исходников.</p>
          </section>}
          {Boolean(article.resourceLinks?.length) && <nav aria-label="Каталог и информация" className="flex flex-wrap gap-3 mt-8">
            {article.resourceLinks?.map((link) => <Link key={link.href} href={link.href} className="btn-secondary">{link.label}</Link>)}
          </nav>}

        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-cream mb-6">Читайте также</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((a) => (
                <Link href={`/poleznoe/${a.slug}`} key={a.id} className="group block">
                  <div className="glass-card p-5 h-full">
                    <span className="section-tag text-[10px] px-2.5 py-1 mb-3 inline-block">{a.category}</span>
                    <h3 className="text-sm font-bold text-cream group-hover:text-gold-300 transition-colors leading-snug">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
