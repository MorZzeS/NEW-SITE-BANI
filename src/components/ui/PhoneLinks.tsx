import { siteSettings } from '@/data'
export function PhoneLinks({ className = '' }: { className?: string }) {
  return <div className={`flex flex-col gap-2 text-sm ${className}`} aria-label="Телефоны для связи">
    <a href={`tel:${siteSettings.phone}`} className="min-h-8 flex items-center" aria-label={`Позвонить: ${siteSettings.phoneDisplay}`}>{siteSettings.phoneDisplay}</a>
    <a href={`tel:${siteSettings.phone2}`} className="min-h-8 flex items-center" aria-label={`Позвонить: ${siteSettings.phoneDisplay2}`}>{siteSettings.phoneDisplay2}</a>
  </div>
}
