import { defaultOpenGraph } from '@/lib/site-metadata'
import { EquipmentConfigurator } from '@/components/catalog/EquipmentConfigurator'

export const metadata = {
  title: 'Комплектация мобильных бань',
  description: 'Базовая и дополнительная комплектация мобильных бань. Что входит в стоимость и что можно добавить.',
  alternates: { canonical: 'https://banger.su/komplektaciya' },

  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/komplektaciya', title: 'Комплектация мобильных бань', description: 'Базовая и дополнительная комплектация мобильных бань. Что входит в стоимость и что можно добавить.' },
}

export default function KomplektaciyaPage() {
  return (
    <EquipmentConfigurator />
  )
}
