import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { articles } from '@/data'

export const metadata = {
  title: 'Полезное — советы и статьи о банях',
  description: 'Советы по выбору, уходу и эксплуатации мобильных бань. Материалы, печи, доставка, подготовка участка.',
}

export default function PoleznoeePage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Полезное</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Советы и статьи</h1>
          <p className="text-cream/60 max-w-lg">
            Всё, что нужно знать о мобильных банях: выбор, эксплуатация, уход и обслуживание
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link href={`/poleznoe/${article.slug}`} key={article.id} className="group block">
              <div className="glass-card p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="section-tag text-[10px] px-3 py-1">{article.category}</span>
                  <span className="flex items-center gap-1 text-xs text-cream/40">
                    <Clock className="w-3 h-3" /> {article.readTime} мин
                  </span>
                </div>
                <h2 className="text-lg font-bold text-cream mb-3 flex-1 group-hover:text-gold-300 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-sm text-cream/60 leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="text-xs text-cream/30 mb-3">
                  {new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 text-gold-400 text-sm font-semibold group-hover:gap-3 transition-all mt-auto">
                  Читать <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
