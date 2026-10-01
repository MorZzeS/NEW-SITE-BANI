export const metadata = { title: 'Реквизиты — Бани Герасимов', description: 'Юридические данные продавца и оператора персональных данных.' }
export default function RekvizityPage() {
  return (
    <div className="pt-28 pb-20 site-container">
      <h1 className="text-4xl font-extrabold text-cream mb-6">Реквизиты</h1>
      <div className="glass rounded-3xl p-8 text-cream/90 space-y-3 text-sm leading-relaxed">
        <p><strong>Продавец / Оператор персональных данных:</strong></p>
        <p>Индивидуальный предприниматель Лещенко Максим Витальевич</p>
        <p><strong>ИНН:</strong> 504810391201</p>
        <p><strong>ОГРНИП:</strong> 319507400024020</p>
        <p><strong>Юридический адрес:</strong> 142300, Россия, Московская область, г. Чехов, ул. Московская, д. 110, кв. 56</p>
        <p><strong>Телефон:</strong> <a href="tel:+79362000050" className="text-gold-300 hover:underline">+7 (936) 200-00-50</a></p>
        <p><strong>Email:</strong> <a href="mailto:info@banger.su" className="text-gold-300 hover:underline">info@banger.su</a></p>
        <p className="text-cream/40 pt-2 text-xs">Банковские реквизиты доступны по запросу для заключения договоров и выставления счетов.</p>
      </div>
    </div>
  )
}
