import { EquipmentConfigurator } from '@/components/catalog/EquipmentConfigurator'

export const metadata = {
  title: 'Комплектация мобильных бань',
  description: 'Базовая и дополнительная комплектация мобильных бань. Что входит в стоимость и что можно добавить.',
}

export default function KomplektaciyaPage() {
  return (
    <EquipmentConfigurator />
  )
}
