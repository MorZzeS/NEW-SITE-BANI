import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { articles, publishedHomes as homes } from '@/data'
import { articleHtmlWithBasePath, withBasePath } from '@/lib/site-path'
import { articleAliases } from '@/data/article-aliases'
import { articlePublicationNotices } from '@/data/article-publication-notices'
import type { Metadata } from 'next'
import { articleInlineVisuals } from '@/data/article-visuals'
import { ArticleMediaAndContent } from '@/components/sections/ArticleMediaAndContent'

function contentWithVisuals(slug: string, content: string) {
  // Hide markdown separators only while rendering; preserve the supplied article source.
  content = content.replace(/<p>\s*---\s*<\/p>/g, '')
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
  for (const visual of articleInlineVisuals[slug] || []) {
    const figure = `<figure class="article-inline-figure"><button type="button" class="article-image-zoom" data-article-zoom="${escapeHtml(withBasePath(visual.src))}" data-article-alt="${escapeHtml(visual.alt)}" aria-label="Увеличить изображение: ${escapeHtml(visual.alt)}"><picture><source srcset="${escapeHtml(withBasePath(visual.avif))}" type="image/avif" /><img src="${escapeHtml(withBasePath(visual.src))}" alt="${escapeHtml(visual.alt)}" width="${visual.width}" height="${visual.height}" loading="lazy" decoding="async" /></picture><span class="article-image-zoom-label"><span aria-hidden="true">＋</span> Увеличить</span></button><figcaption>${escapeHtml(visual.caption)}</figcaption></figure>`
    content = content.replace(`<h2 id="${visual.beforeSection}">`, `${figure}<h2 id="${visual.beforeSection}">`)
  }
  return content
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [...articles.map((a) => ({ slug: a.slug })), ...Object.keys(articleAliases).map((slug) => ({ slug }))]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((a) => a.slug === (articleAliases[slug] || slug))
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === (articleAliases[slug] || slug))
  if (!article) notFound()

  if (articleAliases[slug]) return <div className="site-container pt-32 pb-20"><h1 className="text-3xl font-bold text-cream mb-6">Материал обновлён</h1><p className="text-cream/70 mb-6">Актуальная статья доступна по новому адресу.</p><Link href={`/poleznoe/${article.slug}`} className="btn-primary">{article.title}</Link></div>

  const heroImage = article.image || article.coverImage
  const presentation = article.presentation || 'reference'
  const related = (article.relatedSlugs || []).map((slug) => articles.find((a) => a.slug === slug)).filter((a): a is NonNullable<typeof a> => Boolean(a))
  const publicationNotice = articlePublicationNotices[article.slug]
  const canonical = `https://banger.su/poleznoe/${article.slug}`
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: heroImage ? [`https://banger.su${heroImage}`] : undefined,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'Бани Герасимов' },
    publisher: { '@type': 'Organization', name: 'Бани Герасимов', url: 'https://banger.su' },
    inLanguage: 'ru-RU',
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://banger.su/' },
      { '@type': 'ListItem', position: 2, name: 'Полезное', item: 'https://banger.su/poleznoe' },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
    ],
  }
  const jsonLd = (schema: object) => JSON.stringify(schema).replace(/</g, '\\u003c')

  return (
    <div className={`article-page article-page--${presentation} pt-28 pb-20`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <div className="site-container">
        <nav aria-label="Хлебные крошки" className="article-breadcrumbs">
          <Link href="/" className="hover:text-[var(--color-text)] transition-colors">Главная</Link>
          <span aria-hidden="true">/</span>
          <Link href="/poleznoe" className="hover:text-[var(--color-text)] transition-colors">Полезное</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{article.title}</span>
        </nav>

        <header className={`article-hero-layout article-hero-layout--${presentation}`}>
          <div className="article-introduction">
            <div className="article-reading-meta">
              <span className="section-tag text-xs px-3 py-1.5">{article.category}</span>
              <span className="flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4" aria-hidden="true" /> {article.readTime} мин чтения</span>
            </div>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
          </div>
          {heroImage && <div className="article-hero-media">
            <ArticleMediaAndContent
              presentation={presentation}
              title={article.title}
              hero={{
                src: heroImage,
                alt: article.imageAlt || article.coverAlt || article.title,
                caption: article.imageCaption,
                width: article.imageWidth || 1600,
                height: article.imageHeight || 900,
              }}
              html=""
            />
          </div>}
        </header>

        {publicationNotice && <aside aria-label={publicationNotice.title} role="note" className="article-publication-notice">
          <h2>{publicationNotice.title}</h2>
          <p>{publicationNotice.text}</p>
        </aside>}

        <div className={`article-reading-layout article-reading-layout--${presentation}`}>
          {article.toc && <nav aria-label="Содержание статьи" className={`article-toc article-toc--${presentation}`}>
            <h2>В статье</h2>
            <ol>
              {article.toc.map((item) => <li key={item.id} className={item.level === 3 ? 'article-toc-subitem' : ''}>
                <a href={`#${item.id}`}>{item.title}</a>
              </li>)}
            </ol>
          </nav>}
          <ArticleMediaAndContent
            presentation={presentation}
            title={article.title}
            html={articleHtmlWithBasePath(contentWithVisuals(article.slug, article.content), homes.map((home) => home.slug))}
          />
        </div>

        <aside className="article-cta" aria-labelledby="article-cta-heading">
          <div className="article-cta-copy">
            <span className="section-tag text-xs px-3 py-1.5">Следующий шаг</span>
            <h2 id="article-cta-heading">Подберите мобильную баню под свой участок</h2>
            <p>Сравните модели и комплектации, посмотрите реализованные проекты или обсудите задачу со специалистом.</p>
          </div>
          <div className="article-cta-actions">
            <Link href="/katalog/bani" className="btn-primary">Подобрать баню и комплектацию</Link>
            <Link href="/kontakty#zayavka" className="btn-secondary">Получить консультацию</Link>
            <Link href="/nashi-raboty" className="article-cta-text-link">Реализованные проекты</Link>
          </div>
        </aside>

        {related.length > 0 && <section className="article-related" aria-labelledby="article-related-heading">
          <div className="article-related-heading">
            <span className="section-tag text-xs px-3 py-1.5">Продолжить чтение</span>
            <h2 id="article-related-heading">Читайте по теме</h2>
          </div>
          <div className="article-related-grid">
            {related.map((item) => <Link href={`/poleznoe/${item.slug}`} key={item.id} className="article-related-card">
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <span className="article-related-arrow" aria-hidden="true">→</span>
            </Link>)}
          </div>
        </section>}

        <Link href="/poleznoe" className="article-back-link"><ArrowLeft aria-hidden="true" /> Все полезные статьи</Link>
      </div>
    </div>
  )
}
