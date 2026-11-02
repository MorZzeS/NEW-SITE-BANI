import type { Metadata } from 'next'
import { OnlineLeadForm } from '@/components/forms/OnlineLeadForm'

export const metadata: Metadata = {
  title: 'Проверка формы',
  robots: { index: false, follow: false },
}

export default function TestLeadsPage() {
  return <main className="container mx-auto max-w-2xl px-4 py-24">
    <h1 className="mb-4 text-2xl font-bold">Проверка формы: отправка не подключена</h1>
    <p className="mb-8">Изолированный просмотр формы. Приём заявок и отправка в MAX отключены до подключения тестового сервера, отдельного получателя и утверждённых документов.</p>
    <OnlineLeadForm />
  </main>
}
