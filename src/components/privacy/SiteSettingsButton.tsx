'use client'

export const OPEN_SITE_SETTINGS_EVENT = 'banger:open-site-settings'

export function SiteSettingsButton() {
  return <button type="button" data-site-settings-trigger aria-haspopup="dialog" className="min-h-11 text-left hover:text-cream/70 transition-colors" onClick={() => window.dispatchEvent(new Event(OPEN_SITE_SETTINGS_EVENT))}>Настройки сайта</button>
}
