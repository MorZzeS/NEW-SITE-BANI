import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import type { SiteSettings } from '@/types'

interface Props {
  settings: SiteSettings
}

const footerLinks = {
  catalog: [
    { label: 'Мобильные бани', href: '/katalog/bani' },
    { label: 'Мобильные дома', href: '/katalog/doma' },
    { label: 'Планировки', href: '/planirovki' },
    { label: 'Комплектация', href: '/komplektaciya' },
  ],
  info: [
    { label: 'Доставка и установка', href: '/dostavka-i-ustanovka' },
    { label: 'О нас', href: '/o-kompanii' },
    { label: 'Наши работы', href: '/nashi-raboty' },
    { label: 'Полезное', href: '/poleznoe' },
    { label: 'Контакты', href: '/kontakty' },
  ],
}

export function Footer({ settings }: Props) {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="glass-dark">
        <div className="site-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-wood-600 flex items-center justify-center">
                  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                    <path d="M4 14L16 4L28 14V28H4V14Z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
                    <path d="M12 28V20H20V28" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-cream">БАНИ ГЕРАСИМОВ</div>
                  <div className="text-[10px] text-cream/50 uppercase tracking-widest">Производство мобильных бань</div>
                </div>
              </Link>
              <p className="text-cream/60 text-sm leading-relaxed mb-6">
                Собственное производство мобильных бань и домов. Доставка и установка по Москве и Московской области.
              </p>
              <div className="flex items-center gap-3">
                <a href={settings.vk} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-cream hover:bg-white/10 transition-all text-xs font-bold">
                  VK
                </a>
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-cream hover:bg-white/10 transition-all">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cream/70 hover:text-cream hover:bg-white/10 transition-all text-xs font-bold">
                  YT
                </a>
              </div>
            </div>

            {/* Catalog links */}
            <div>
              <h4 className="text-sm font-semibold text-cream mb-4">Каталог</h4>
              <ul className="space-y-2.5">
                {footerLinks.catalog.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-cream/60 hover:text-cream transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info links */}
            <div>
              <h4 className="text-sm font-semibold text-cream mb-4">Компания</h4>
              <ul className="space-y-2.5">
                {footerLinks.info.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-cream/60 hover:text-cream transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="text-sm font-semibold text-cream mb-4">Контакты</h4>
              <ul className="space-y-3">
                <li>
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 text-sm text-cream/70 hover:text-cream transition-colors">
                    <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                    {settings.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-sm text-cream/70 hover:text-cream transition-colors">
                    <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-cream/70">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  {settings.address}
                </li>
                <li className="flex items-center gap-2.5 text-sm text-cream/70">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  {settings.workingHours}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          <div className="site-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
            <p>© {new Date().getFullYear()} Бани Герасимов. Все права защищены.</p>
            <div className="flex items-center gap-5">
              <a href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs" target="_blank" rel="noopener noreferrer" className="text-xs text-cream/40 hover:text-cream/70 transition-colors">MAX</a>
              <Link href="/politika" className="hover:text-cream/70 transition-colors">Политика ПДн</Link>
              <Link href="/privacy" className="hover:text-cream/70 transition-colors">Конфиденциальность</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
