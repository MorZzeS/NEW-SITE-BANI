import { defaultOpenGraph } from '@/lib/site-metadata'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { articles } from '@/data'
import { withBasePath } from '@/lib/site-path'
import { articleCoverPositions } from '@/data/article-visuals'

export const metadata = {
  title: 'Полезное — советы и статьи о банях',
  description: 'Советы по выбору, уходу и эксплуатации мобильных бань. Материалы, печи, доставка, подготовка участка.',
  alternates: {
    canonical: 'https://banger.su/poleznoe',
  },

  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/poleznoe', title: 'Полезное — советы и статьи о банях', description: 'Советы по выбору, уходу и эксплуатации мобильных бань. Материалы, печи, доставка, подготовка участка.' },
}

export default function PoleznoeePage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Полезное</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-cream mb-3">Советы и статьи</h1>
          <p className="text-cream/60 max-w-lg">
            Всё, что нужно знать о мобильных банях: выбор, эксплуатация, уход и обслуживание
          </p>
        </div>

        <div className="article-index-grid">
          {articles.map((article) => (
            <Link href={`/poleznoe/${article.slug}`} key={article.id} className="article-index-card group">
              <article className={`article-index-card-inner article-index-card-inner--${article.presentation || 'reference'}`}>
                {article.coverImage && <picture className="article-index-image">
                  {article.imageAvif && <source srcSet={withBasePath(article.imageAvif)} type="image/avif" />}
                  <img src={withBasePath(article.coverImage)} alt={article.coverAlt || article.title} width={article.imageWidth || 1600} height={article.imageHeight || 900} loading="lazy" decoding="async" style={{ objectPosition: articleCoverPositions[article.slug] || 'center' }} />
                  {article.imageCaption?.includes('3D-визуализация') && <span className="article-index-visual-badge">3D-визуализация</span>}
                  <span className="article-index-image-label">{article.category}</span>
                </picture>}
                <div className="article-index-copy">
                  <div className="article-index-meta">
                    <span>{article.readTime} мин чтения</span>
                    {article.updatedAt && <span>Обновлено</span>}
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                  <span className="article-index-read">Читать статью <ArrowRight aria-hidden="true" /></span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
