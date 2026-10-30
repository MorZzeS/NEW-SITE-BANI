import { Fragment, type ReactNode } from 'react'
import documents from '@/data/site-legal.json'
import { withBasePath } from '@/lib/site-path'

type Block = { type: string; text?: string; headers?: string[]; rows?: string[][] }

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="text-[0.9em] [overflow-wrap:anywhere]">{part.slice(1, -1)}</code>
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="font-semibold text-cream">{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link && /^(?:https?:\/\/|mailto:|\/)/.test(link[2])) return <a key={index} href={withBasePath(link[2])} className="underline underline-offset-4 text-gold-400" {...(link[2].startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{link[1]}</a>
    return <Fragment key={index}>{part}</Fragment>
  })
}

export function LegalDocument({ kind }: { kind: keyof typeof documents }) {
  const document = documents[kind]
  return <article className="pt-28 pb-20"><div className="prose-column">
    <p className="section-tag mb-4">Документы BANGER.SU</p>
    <h1 className="text-3xl sm:text-4xl font-bold text-cream mb-5">{document.title}</h1>
    <p className="text-sm text-cream/60 mb-7">Редакция от 27 октября 2026 года · версия {document.version}</p>
    <nav aria-label="Содержание документа" className="border-y border-[var(--glass-border)] py-5 mb-9"><ol className="space-y-2 text-sm text-gold-400">{document.sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="underline-offset-4 hover:underline">{section.title}</a></li>)}</ol></nav>
    <div className="space-y-10">{document.sections.map(section => <section id={section.id} key={section.id} className="scroll-mt-28">
      <h2 className="text-xl sm:text-2xl font-semibold text-cream mb-4">{section.title}</h2>
      <div className="space-y-4 text-sm leading-7 text-cream/75">{(section.blocks as Block[]).map((block, index) => block.type === 'table'
        ? <div key={index} className="overflow-x-auto"><table className="w-full border-collapse text-xs leading-6"><thead><tr>{block.headers?.map(header => <th key={header} scope="col" className="border-b border-[var(--glass-border)] py-3 pr-3 text-left font-semibold text-cream">{inline(header)}</th>)}</tr></thead><tbody>{block.rows?.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-[var(--glass-border)] py-3 pr-3 align-top [overflow-wrap:anywhere]">{inline(cell)}</td>)}</tr>)}</tbody></table></div>
        : <p key={index} className="[overflow-wrap:anywhere]">{inline(block.text || '')}</p>)}</div>
    </section>)}</div>
    <footer className="mt-12 border-t border-[var(--glass-border)] pt-6 text-sm text-cream/70">По вопросам данных и отзыва согласия: <a href="mailto:banger.ram@bk.ru" className="text-gold-400 underline">banger.ram@bk.ru</a>.</footer>
  </div></article>
}
