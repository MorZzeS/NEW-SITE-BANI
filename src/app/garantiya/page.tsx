import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, FileText, Hash, ShieldCheck } from 'lucide-react'
import { defaultOpenGraph } from '@/lib/site-metadata'
import { warrantyContent } from '@/data/warranty'

const title = 'Гарантия 12 месяцев на конструкцию бани'
const description = '12 месяцев гарантии на конструктивные элементы бани. Условия гарантии и порядок обращения по вопросам качества изготовления.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://banger.su/garantiya' },
  openGraph: {
    ...defaultOpenGraph,
    url: 'https://banger.su/garantiya',
    title,
    description,
  },
}

const steps = [
  { icon: Hash, title: 'Сообщите данные о заказе', text: 'Если номер заказа сохранился, укажите его — это поможет найти документы по покупке.' },
  { icon: FileText, title: 'Опишите вопрос', text: 'Коротко расскажите, что произошло и когда вы это заметили.' },
  { icon: Camera, title: 'Приложите материалы при необходимости', text: 'Если потребуется, мы попросим фотографии или видео.' },
]

export default function WarrantyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(280px,.9fr)_minmax(0,1.1fr)] lg:gap-14" aria-labelledby="warranty-title">
          <figure className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-[#d8c9a8] bg-[#f7f2e8] p-5 text-[#292821] shadow-[0_18px_48px_rgba(0,0,0,.18)] sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#e8d8b4]/50 blur-3xl" />
            <div className="relative rounded-2xl border border-[#d5c8aa] bg-white/70 p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-3 border-b border-[#ded4c0] pb-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6b74c] text-[#302b20]">
                  <ShieldCheck aria-hidden="true" size={25} strokeWidth={1.8} />
                </span>
                <span className="text-xs font-bold uppercase tracking-[.16em]">Бани Герасимов</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#936c22]">Информация о гарантии</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">12 месяцев</p>
              <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-[#5f5a4e]">на конструктивные элементы бани</p>
              <div aria-hidden="true" className="mt-8 space-y-2.5">
                <span className="block h-2 w-full rounded bg-[#e7e0d2]" />
                <span className="block h-2 w-[88%] rounded bg-[#e7e0d2]" />
                <span className="block h-2 w-[70%] rounded bg-[#e7e0d2]" />
              </div>
            </div>
            <figcaption className="sr-only">Декоративная иллюстрация информации о гарантии, не является отдельным гарантийным документом.</figcaption>
          </figure>

          <div className="max-w-2xl">
            <p className="section-tag mb-4">Гарантия и поддержка</p>
            <h1 id="warranty-title" className="text-4xl font-extrabold leading-tight text-cream sm:text-5xl">{warrantyContent.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-cream/75">{warrantyContent.description}</p>
            <Link href="/kontakty" className="btn-primary mt-7 inline-flex min-h-12 items-center justify-center gap-2 px-6">Связаться по гарантии</Link>
          </div>
        </section>

        <details className="mt-10 rounded-xl border border-white/12 px-5 py-4 sm:px-6">
          <summary className="cursor-pointer text-base font-semibold text-cream">Подробнее об условиях гарантии</summary>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-cream/75">
            <p><strong className="text-cream">Состав гарантии.</strong> Гарантия на конструктивные элементы бани составляет 12 месяцев. Перечень элементов и подробные условия закрепляются в документах заказа.</p>
            <p><strong className="text-cream">Рассмотрение обращения.</strong> Мы изучим описание вопроса и документы заказа, при необходимости попросим фотографии или видео и сообщим о дальнейших действиях. Порядок рассмотрения недостатков определяется документами заказа и применимым законодательством. Законные права покупателя сохраняются.</p>
          <h2 id="warranty-steps-title" className="text-xl font-bold text-cream">Что сообщить при обращении</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title: stepTitle, text }, index) => (
              <li key={stepTitle} className="flex gap-4 border-t border-gold-400/35 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-400/40 text-gold-300" aria-hidden="true">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-gold-300">Шаг {index + 1}</p>
                  <h3 className="mt-1 font-semibold text-cream">{stepTitle}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cream/65">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>
        </details>
      </div>
    </div>
  )
}
