import type { Metadata } from 'next'
import { CTAFormInline } from '@/components/forms/CTAFormInline'

export const metadata: Metadata = {
  title: 'Проверка формы',
  robots: { index: false, follow: false },
}

export default function TestLeadsPage() {
  return <main className="container mx-auto max-w-2xl px-4 py-24">
    <h1 className="mb-4 text-2xl font-bold">Проверка формы заявки</h1>
    <p className="mb-8">Служебный маршрут для проверки формы «Свяжитесь с нами». Страница закрыта от индексации; в тестовой сборке с настроенным HTTPS-адресом заявка уходит на сервер и в MAX.</p>
    <CTAFormInline />
  </main>
}
