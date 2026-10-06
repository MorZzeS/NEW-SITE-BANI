import { socialLinks } from '@/data/social'
import { MessageCircle, Users, Send, Instagram } from 'lucide-react'
const icons = { max: MessageCircle, vk: Users, telegram: Send, instagram: Instagram }
export function SocialBlock({ compact = false }: { compact?: boolean }) {
  const content = <div className={compact ? 'social-qr-grid' : 'grid grid-cols-2 md:grid-cols-4 gap-5'}>
    {socialLinks.map(item => { const Icon = icons[item.id]; return <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className={compact ? 'social-qr-item' : 'text-center min-w-0 flex flex-col items-center gap-3'} aria-label={`Открыть ${item.name}`}>
      <span className="social-qr-name text-sm font-semibold flex items-center justify-center gap-2"><Icon aria-hidden="true" size={16} className="text-gold-400" />{item.name}</span>
      <img src={item.qr} alt={`QR-код ${item.name}`} width={140} height={140} loading="lazy" className={compact ? 'social-qr-image' : 'w-[140px] max-w-full bg-white rounded-md'} />
      {!compact && <span className="text-sm text-gold-400">Написать в {item.name}</span>}
    </a>})}
  </div>
  if (compact) return <aside aria-label="Наши социальные сети" className="hero-social"><p className="text-xs text-cream/75 mb-3">Мы на связи</p>{content}</aside>
  return <section aria-label="Наши социальные сети" className="py-10 border-t border-white/10">{content}</section>
}
