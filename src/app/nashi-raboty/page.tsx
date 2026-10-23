import { RealWorksGallery } from '@/components/sections/RealWorksGallery'
export const metadata = { title: 'Наши работы — фотографии', description: 'Фотографии наших работ: внешний вид, интерьеры и детали.', alternates: { canonical: 'https://banger.su/nashi-raboty' } }
export default function NashiRabotyPage() {
  return <div className="pt-28 pb-20"><div className="site-container"><div className="mb-12"><div className="section-tag mb-4">Клиентский объект и выставочный образец</div><h1 className="text-4xl sm:text-5xl font-extrabold text-cream mb-3">Наши работы</h1><p className="text-cream/60 max-w-lg">Две карточки с подробной информацией. Временный пример будет заменён, когда подготовим материалы другого реального объекта.</p></div><RealWorksGallery limit={2} /></div></div>
}
