import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ReceiptText } from 'lucide-react'
import { defaultOpenGraph } from '@/lib/site-metadata'

const title = 'Оплата и документы'
const description = 'Порядок согласования оплаты и документов для конкретного заказа.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://banger.su/oplata-i-cheki' },
  openGraph: {
    ...defaultOpenGraph,
    url: 'https://banger.su/oplata-i-cheki',
    title,
    description,
  },
}

export default function PaymentAndReceiptPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container max-w-4xl">
        <Link href="/dostavka-i-ustanovka" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4">
          <ArrowLeft aria-hidden="true" size={17} />
          Доставка и установка
        </Link>
        <article className="rounded-[2rem] border border-white/15 bg-white/[.045] p-6 sm:p-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10 text-gold-300">
            <ReceiptText aria-hidden="true" size={24} strokeWidth={1.7} />
          </div>
          <p className="section-tag mb-3">Условия заказа</p>
          <h1 className="text-3xl font-extrabold text-cream sm:text-4xl">Оплата и документы</h1>
          <p className="mt-6 max-w-[70ch] text-base leading-relaxed text-cream/75">Доступные способы, сроки и этапы оплаты согласуются для конкретного заказа и фиксируются в договоре и счёте. До оплаты менеджер сообщит, какие документы будут оформлены для выбранного способа расчёта.</p>
          <Link href="/dostavka-i-ustanovka" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-gold-300 underline underline-offset-4">Доставка и установка →</Link>
        </article>
      </div>
    </div>
  )
}
