import { socialLinks } from '@/data/social'
import { MessageCircle, Users, Send, Instagram } from 'lucide-react'
const icons = { max: MessageCircle, vk: Users, telegram: Send, instagram: Instagram }
export function SocialBlock({ compact = false }: { compact?: boolean }) {
  const qr = <div className={`grid grid-cols-2 ${compact ? '' : 'md:grid-cols-4'} gap-5`}>
    {socialLinks.map(item => { const Icon = icons[item.id]; return <div key={item.id} className="text-center min-w-0">
      <p className="text-sm font-semibold mb-3 flex items-center justify-center gap-2"><Icon aria-hidden="true" size={16} className="text-gold-400" />{item.name}</p>
      {item.url && item.qr ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-3 text-sm text-gold-400" aria-label={`Открыть ${item.name}`}>
        <img src={item.qr} alt={`QR-код ${item.name}`} width={140} height={140} loading="lazy" className="w-[140px] max-w-full bg-white rounded-md" /><span>Написать в {item.name}</span>
      </a> : <div className="min-h-[140px] flex items-center justify-center text-xs text-cream/60">Ссылка пока не добавлена</div>}
    </div>})}
  </div>
  if (compact) return <aside className="hero-social w-full xl:w-64 shrink-0 xl:mt-12">
    <p className="text-xs text-cream/75 mb-3">Мы на связи</p>
    <div className="flex flex-wrap gap-x-4 gap-y-3">{socialLinks.map(item => item.url ? <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cream min-h-11 flex items-center">{item.name}</a> : <span key={item.id} className="text-xs text-cream/60 min-h-11 flex items-center">{item.name} · скоро</span>)}</div>
    <details className="mt-2"><summary className="text-xs text-cream/75 cursor-pointer min-h-11 flex items-center">QR-коды и ссылки</summary><div className="glass p-4 rounded-xl mt-2">{qr}</div></details>
  </aside>
  return <section aria-label="Наши социальные сети" className="py-10 border-t border-white/10">{qr}</section>
}
