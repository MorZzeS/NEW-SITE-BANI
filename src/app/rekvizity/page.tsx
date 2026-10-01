export const metadata = { title: 'Реквизиты', description: 'Юридические данные компании Бани Герасимов (BANGER.SU).' }
export default function RekvizityPage() {
  return (
    <div className="pt-28 pb-20 site-container">
      <h1 className="text-4xl font-extrabold text-cream mb-6">Реквизиты</h1>
      <div className="glass rounded-3xl p-8 text-cream/70 space-y-3 text-sm">
        <p>Юридические реквизиты компании «Бани Герасимов» (BANGER.SU) будут опубликованы после получения подтверждённых данных от владельца. Обратитесь за деталями по телефону или в мессенджере.</p>
        <p>До получения данных страница отображается как заглушка с указанием, что информация будет добавлена после предоставления владельцем.</p>
      </div>
    </div>
  )
}
