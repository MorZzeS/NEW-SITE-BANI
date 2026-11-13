import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Download, FileCheck2 } from 'lucide-react'
import { defaultOpenGraph } from '@/lib/site-metadata'
import { withBasePath } from '@/lib/site-path'
import styles from './page.module.css'

const title = 'Образец договора'
const description = 'Образец договора BANGER.SU с пятью приложениями: комплектация, стоимость, доставка, приёмка и гарантия. Просмотр и скачивание PDF.'
const pdfPath = '/documents/banger-contract-sample.pdf'
const appendices = [
  'Спецификация, комплектация, дополнительные опции, стоимость и сроки',
  'Условия доставки, разгрузки и подготовки места установки',
  'Гарантийные условия и порядок обращения по гарантии',
  'Инструкция по эксплуатации и правила техники безопасности',
  'Акт приёма-передачи Изделия',
]

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: 'https://banger.su/obrazec-dogovora' },
  openGraph: { ...defaultOpenGraph, title, description, url: 'https://banger.su/obrazec-dogovora' },
}

export default function ContractSamplePage() {
  const pdfUrl = withBasePath(pdfPath)
  return <div className={`site-container pt-28 pb-12 ${styles.page}`}>
    <header className={styles.header}>
      <p className="section-tag">Прозрачные условия заказа</p>
      <h1>Образец договора</h1>
      <p>Предлагаем ознакомиться с образцом договора до оформления заказа. В документе описаны условия изготовления, комплектация, порядок оплаты, доставка, установка, приёмка изделия и гарантийные обязательства. Индивидуальные характеристики, стоимость и сроки согласовываются отдельно и фиксируются в договоре и приложениях.</p>
      <div className={styles.actions}>
        <a className="btn-primary" href={pdfUrl} download="BANGER_obrazec_dogovora.pdf"><Download size={18} aria-hidden="true" />Скачать образец договора</a>
        <Link className={styles.link} href="/garantiya">Гарантийные условия<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </header>
    <div className={styles.information}>
      <section aria-labelledby="contract-terms-title">
        <h2 id="contract-terms-title"><FileCheck2 size={21} aria-hidden="true" />Основные условия</h2>
        <ul>
          <li>Модель, размеры, планировка и комплектация фиксируются индивидуально.</li>
          <li>Стоимость, порядок оплаты и срок изготовления согласовываются в договоре.</li>
          <li>Условия доставки, разгрузки, установки и адрес указываются в приложениях.</li>
          <li>Гарантия на качество изготовления и сборки — 12 месяцев. Законные права покупателя сохраняются.</li>
        </ul>
      </section>
      <section aria-labelledby="contract-appendices-title">
        <h2 id="contract-appendices-title">Пять приложений к договору</h2>
        <ol>{appendices.map((name, index) => <li key={name}><span className={styles.number}>{index + 1}</span>{name}</li>)}</ol>
      </section>
    </div>
    <section className={styles.preview} aria-labelledby="contract-preview-title">
      <div className={styles.previewHeading}><h2 id="contract-preview-title">Документ для ознакомления</h2><a href={pdfUrl} target="_blank" rel="noopener noreferrer">Открыть PDF<ArrowUpRight size={16} aria-hidden="true" /></a></div>
      <iframe src={`${pdfUrl}#view=FitH`} title="Образец договора BANGER.SU с пятью приложениями" className={styles.frame} loading="lazy" />
      <p className={styles.note}>Это обезличенный образец. Перед подписанием заполняем характеристики вашего изделия, согласованную стоимость, сроки и условия работ. Если браузер не поддерживает встроенный просмотр, откройте или скачайте PDF по ссылке выше.</p>
    </section>
  </div>
}
