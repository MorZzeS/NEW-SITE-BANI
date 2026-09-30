import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { articles } from '@/data'

export function ArticlesSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="section-tag mb-3">Советы и статьи</div>
            <h2 className="text-4xl font-bold text-cream">Полезное</h2>
          </div>
          <Link href="/poleznoe" className="btn-secondary px-5 py-2.5 text-sm whitespace-nowrap">
            Все статьи <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.slice(0, 6).map((article) => (
            <Link href={`/poleznoe/${article.slug}`} key={article.id} className="group block">
              <div className="glass-card p-5 h-full flex flex-col">
                {/* Category + read time */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="section-tag text-[10px] px-3 py-1">{article.category}</span>
                  <span className="flex items-center gap-1 text-xs text-cream/40">
                    <Clock className="w-3 h-3" /> {article.readTime} мин
                  </span>
                </div>
                <h3 className="text-base font-bold text-cream mb-2 flex-1 group-hover:text-gold-300 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-cream/60 leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-1.5 text-gold-400 text-sm font-semibold group-hover:gap-3 transition-all mt-auto">
                  Читать <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
