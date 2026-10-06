import { siteSettings } from '@/data'
export const socialLinks = [
  { id: 'max', name: 'MAX', url: siteSettings.max, icon: 'M', qr: '/NEW-SITE-BANI/images/social/max-qr.svg' },
  { id: 'vk', name: 'VK', url: 'https://vk.ru/banigerasimov', icon: 'VK', qr: '/NEW-SITE-BANI/images/social/vk-qr.svg' },
  { id: 'telegram', name: 'Telegram', url: siteSettings.telegram, icon: 'T', qr: '/NEW-SITE-BANI/images/social/telegram-qr.svg' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/banigerasimov?stkn=ZHR3d3M3eTRqYnJh&utm_source=qr', icon: 'IG', qr: '/NEW-SITE-BANI/images/social/instagram-qr.svg' },
] as const
