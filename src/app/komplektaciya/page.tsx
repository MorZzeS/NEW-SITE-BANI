import { Equipment } from '@/components/catalog/Equipment'
import { Check } from 'lucide-react'
import { CTAFormInline } from '@/components/forms/CTAFormInline'

export const metadata = {
  title: 'Комплектация мобильных бань',
  description: 'Базовая и дополнительная комплектация мобильных бань. Что входит в стоимость и что можно добавить.',
}

export default function KomplektaciyaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Комплектация</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Комплектация бань</h1>
          <p className="text-cream/60 max-w-lg">
            Комплектация определяется выбранной моделью и исполнением.
            Дополнительные опции — под ваши пожелания.
          </p>
        </div>

        <div className="mb-12"><Equipment /></div>

        <CTAFormInline />
      </div>
    </div>
  )
}
