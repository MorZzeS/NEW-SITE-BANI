import Link from 'next/link'
export const metadata = { title: 'Локальные настройки сайта', description: 'Как BANGER.SU использует локальное хранение настроек браузера.', alternates: { canonical: 'https://banger.su/cookie' } }
export default function CookiePage() {
  return <div className="pt-28 pb-20"><div className="prose-column"><h1 className="text-4xl font-bold text-cream mb-8">Локальные настройки сайта</h1><div className="glass rounded-3xl p-8 text-cream/70 space-y-5 text-sm leading-relaxed">
    <p>Тема оформления хранится в localStorage под ключом banger-theme. Если в браузере ранее было сохранено избранное, интерфейс может читать список моделей banger-favorites. Выбор опций и сравнение работают в состоянии текущей страницы.</p>
    <p>Эти функции не запрашивают имя, телефон или текст обращения. Чтобы удалить сохранённые настройки, используйте управление данными сайта в браузере.</p>
    <p>Метрика, Webvisor, автоматическая погода и встроенные карта и отзывы в этой версии отключены. Сохранённое ранее разрешение аналитики не включает счётчик. Сайт не предлагает дать согласие на отсутствующую аналитику.</p>
    <p>Телефон, почта, мессенджеры, карта и отзывы доступны обычными ссылками. После перехода работают правила выбранного внешнего сервиса.</p>
    <Link href="/privacy" className="inline-block underline">Как сайт использует данные</Link>
  </div></div></div>
}
