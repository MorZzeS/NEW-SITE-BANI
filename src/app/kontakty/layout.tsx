import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакты — Бани Герасимов',
  description: 'Свяжитесь с нами: телефон +7 (936) 200-00-50, Telegram, MAX. Работаем Пн–Вс 9:00–19:00. Адрес: Раменское, Московская область.',
  alternates: { canonical: 'https://banger.su/kontakty' },
  openGraph: {
    url: 'https://banger.su/kontakty',
    title: 'Контакты — Бани Герасимов',
    description: 'Позвоните, напишите или оставьте заявку на расчёт мобильной бани.',
  },
}

export default function KontaktyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
