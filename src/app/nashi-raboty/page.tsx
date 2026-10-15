import { RealWorksGallery } from '@/components/sections/RealWorksGallery'
export const metadata = { title: 'Наши работы — фотографии', description: 'Фотографии наших работ: внешний вид, интерьеры и детали.' }
export default function NashiRabotyPage() {
  return <div className="pt-28 pb-20"><div className="site-container"><div className="mb-12"><div className="section-tag mb-4">Портфолио производства</div><h1 className="text-4xl sm:text-5xl font-extrabold text-cream mb-3">Наши работы</h1><p className="text-cream/60 max-w-lg">Внешний вид, интерьеры и детали наших работ. Откройте фотографию, чтобы рассмотреть её подробнее.</p></div><RealWorksGallery /></div></div>
}
