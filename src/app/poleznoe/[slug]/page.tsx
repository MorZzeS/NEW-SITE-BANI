import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { articles } from '@/data'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const related = articles.filter((a) => a.id !== article.id).slice(0, 3)

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
            <span className="text-sm text-cream/40">
              {new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-cream mb-6 leading-tight">{article.title}</h1>

          <p className="text-xl text-cream/70 leading-relaxed mb-8 font-medium">{article.excerpt}</p>

          <div className="glass rounded-3xl p-8 text-cream/70 leading-relaxed space-y-4">
            <p>
              Мобильные бани — это современное решение для тех, кто хочет иметь настоящую русскую баню
              на своём участке без дорогостоящего капитального строительства. Главное преимущество —
              готовая баня приезжает уже собранной и устанавливается за один день.
            </p>
            <p>
              В этом материале мы подробно расскажем о ключевых аспектах, которые нужно учесть
              при выборе мобильной бани, чтобы не разочароваться в покупке через год эксплуатации.
            </p>
            <h2 className="text-xl font-bold text-cream pt-4">Размер имеет значение</h2>
            <p>
              Самая распространённая ошибка — брать слишком маленькую баню. Минимально комфортный
              вариант для семьи из 3–4 человек — 6 метров. Баня 4 метра — это скорее вариант для
              одного-двух человек или как дополнение к большой зоне отдыха.
            </p>
            <h2 className="text-xl font-bold text-cream pt-4">Утепление — ключевой параметр</h2>
            <p>
              Стандартное утепление 100 мм базальтовой ваты подходит для большинства регионов России.
              Если вы планируете использовать баню зимой при морозах ниже -30°C, рекомендуем выбрать
              модели с утеплением 150 мм и тройным стеклопакетом.
            </p>
            <h2 className="text-xl font-bold text-cream pt-4">Планировка под задачи</h2>
            <p>
              Для настоящего банного ритуала важно иметь три помещения: парную, мойку и комнату отдыха.
              Двухкомнатные модели (парная + предбанник) — это бюджетный вариант, но в нём не хватает
              места для полноценного отдыха после парной.
            </p>
          </div>
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
