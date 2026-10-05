import type { Sauna, Home, Article, Project, SiteSettings } from '@/types'

export const siteSettings: SiteSettings = {
  phone: '+79362000050',
  phoneDisplay: '8 (936) 200-00-50',
  phone2: '+79363000050',
  email: 'info@banger.su',
  address: 'Раменское, ул. Михалевича, 143Е',
  addressShowroom: 'Раменское, ул. Михалевича, 118к1',
  telegram: 'https://t.me/banigerasimov',
  max: 'https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs',
  vk: '#', youtube: '#',
  workingHours: 'Пн–Вс: 9:00–19:00',
}

export const saunas: Sauna[] = [
  { id: 'bg-01', slug: 'istok-4', name: "Исток 4", article: "БГ-01", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Компактный формат с парной и комнатой отдыха.", description: "Компактный формат с парной и комнатой отдыха.", image: "/NEW-SITE-BANI/images/catalog/bg-01/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-01/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-01.png', size: "4 × 2,4 м", area: 9.6, priceFrom: 357500, priceVariants: ["Брус: 370 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4 × 2,4 м"}, {"label": "Площадь застройки", "value": "9,6 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false, interiorImages: ['/NEW-SITE-BANI/images/interiors/parnaya-2-.jpg','/NEW-SITE-BANI/images/interiors/pomiv-.jpg','/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-1.jpg'] },
  { id: 'bg-02', slug: 'istok-terra-5', name: "Исток Терра 5", article: "БГ-02", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Двухзонная баня с отдельным входным крыльцом. По исходному плану: модуль 5 м и крыльцо 1 м.", description: "Двухзонная баня с отдельным входным крыльцом. По исходному плану: модуль 5 м и крыльцо 1 м.", image: "/NEW-SITE-BANI/images/catalog/bg-02/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-02/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-02.png', size: "5 × 2,4 м + крыльцо", area: 12.0, priceFrom: 416000, priceVariants: ["Брус: 429 000 ₽"], tags: [], specs: [{"label": "Размер", "value": "5 × 2,4 м + крыльцо"}, {"label": "Площадь застройки", "value": "12,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { id: 'bg-03', slug: 'istok-5', name: "Исток 5", article: "БГ-03", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Дополнительное пространство в простом прямоугольном модуле.", description: "Дополнительное пространство в простом прямоугольном модуле.", image: "/NEW-SITE-BANI/images/catalog/bg-03/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-03/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-03.png', size: "5 × 2,4 м", area: 12.0, priceFrom: 409500, priceVariants: ["Брус: 422 500 ₽"], tags: [], specs: [{"label": "Размер", "value": "5 × 2,4 м"}, {"label": "Площадь застройки", "value": "12,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-04', slug: 'istok-6', name: "Исток 6", article: "БГ-04", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Увеличенный модуль с парной и зоной отдыха.", description: "Увеличенный модуль с парной и зоной отдыха.", image: "/NEW-SITE-BANI/images/catalog/bg-04/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-04/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-04.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 429000, priceVariants: ["Брус: 435 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-05', slug: 'istok-semeynyy-7', name: "Исток Семейный 7", article: "БГ-05", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Раздельные зоны и вход со стороны длинного фасада.", description: "Раздельные зоны и вход со стороны длинного фасада.", image: "/NEW-SITE-BANI/images/catalog/bg-05/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-05/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-05.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 461500, priceVariants: ["Брус: 474 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: true, hasTerrace: false, hasShower: false },
  { id: 'bg-06', slug: 'istok-semeynyy-7r', name: "Исток Семейный 7R", article: "БГ-06", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Альтернативное расположение помещений: парная справа на плане.", description: "Альтернативное расположение помещений: парная справа на плане.", image: "/NEW-SITE-BANI/images/catalog/bg-06/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-06/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-06.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 461500, priceVariants: ["Брус: 474 500 ₽"], tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { id: 'bg-07', slug: 'istok-prostor-7', name: "Исток Простор 7", article: "БГ-07", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Другая пропорция помещений в семиметровом модуле.", description: "Другая пропорция помещений в семиметровом модуле.", image: "/NEW-SITE-BANI/images/catalog/bg-07/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-07/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-07.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 455000, priceVariants: ["Брус: 468 000 ₽"], tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-08', slug: 'istok-8', name: "Исток 8", article: "БГ-08", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Самый длинный модуль серии с отдельными зонами отдыха и парения.", description: "Самый длинный модуль серии с отдельными зонами отдыха и парения.", image: "/NEW-SITE-BANI/images/catalog/bg-08/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-08/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-08.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 546000, priceVariants: ["Брус: 585 000 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-09', slug: 'skandinaviya-mini-45', name: "Скандинавия Мини 4,5", article: "БГ-09", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Компактная баня с входной площадкой.", description: "Компактная баня с входной площадкой.", image: "/NEW-SITE-BANI/images/catalog/bg-09/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-09/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-09.png', size: "4,5 × 2,4 м", area: 10.8, priceFrom: 520000, priceVariants: ["Брус: 533 000 ₽"], tags: [], specs: [{"label": "Размер", "value": "4,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "10,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { id: 'bg-10', slug: 'skandinaviya-start-6', name: "Скандинавия Старт+ 6", article: "БГ-10", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Крытое крыльцо, комната отдыха и парная. Две основные внутренние зоны в шестиметровом формате.", description: "Крытое крыльцо, комната отдыха и парная. Две основные внутренние зоны в шестиметровом формате.", image: "/NEW-SITE-BANI/images/catalog/bg-10/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-10/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-10.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 552500, priceVariants: ["Брус: 565 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { id: 'bg-11', slug: 'skandinaviya-start-65', name: "Скандинавия Старт+ 6,5", article: "БГ-11", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Три помещения и небольшой запас пространства у входа.", description: "Три помещения и небольшой запас пространства у входа.", image: "/NEW-SITE-BANI/images/catalog/bg-11/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-11/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-11.png', size: "6,5 × 2,4 м", area: 15.6, priceFrom: 585000, priceVariants: ["Брус: 598 000 ₽"], tags: [], specs: [{"label": "Размер", "value": "6,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "15,6 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { id: 'bg-12', slug: 'skandinaviya-standart-7', name: "Скандинавия Стандарт 7", article: "БГ-12", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Комната отдыха, моечная и парная в одном модуле.", description: "Комната отдыха, моечная и парная в одном модуле.", image: "/NEW-SITE-BANI/images/catalog/bg-12/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-12/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-12.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 591500, priceVariants: ["Брус: 604 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { id: 'bg-13', slug: 'skandinaviya-standart-75', name: "Скандинавия Стандарт+ 7,5", article: "БГ-13", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Удлинённая версия с разделением основных зон.", description: "Удлинённая версия с разделением основных зон.", image: "/NEW-SITE-BANI/images/catalog/bg-13/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-13/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-13.png', size: "7,5 × 2,4 м", area: 18.0, priceFrom: 617500, priceVariants: ["Брус: 630 500 ₽"], tags: [], specs: [{"label": "Размер", "value": "7,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "18,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { id: 'bg-14', slug: 'skandinaviya-komfort-6', name: "Скандинавия Комфорт 6", article: "БГ-14", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Боковой вход и отдельная моечная зона.", description: "Боковой вход и отдельная моечная зона.", image: "/NEW-SITE-BANI/images/catalog/bg-14/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-14/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-14.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 591500, priceVariants: ["Брус: 604 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: true },
  { id: 'bg-15', slug: 'skandinaviya-komfort-8', name: "Скандинавия Комфорт 8", article: "БГ-15", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Просторный формат с входной площадкой.", description: "Просторный формат с входной площадкой.", image: "/NEW-SITE-BANI/images/catalog/bg-15/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-15/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-15.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 676000, priceVariants: ["Брус: 689 000 ₽"], tags: [], specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: true },
  { id: 'bg-16', slug: 'skandinaviya-komfort-plus-6', name: "Скандинавия Комфорт+ 6", article: "БГ-16", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Комната отдыха, моечная, парная и санузел по плану.", description: "Комната отдыха, моечная, парная и санузел по плану.", image: "/NEW-SITE-BANI/images/catalog/bg-16/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-16/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-16.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 585000, priceVariants: ["Брус: 598 000 ₽"], tags: [], specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { id: 'bg-17', slug: 'skandinaviya-komfort-plus-7', name: "Скандинавия Комфорт+ 7", article: "БГ-17", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Расширенная планировка с санузлом и отдельной моечной.", description: "Расширенная планировка с санузлом и отдельной моечной.", image: "/NEW-SITE-BANI/images/catalog/bg-17/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-17/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-17.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 643500, priceVariants: ["Брус: 656 500 ₽"], tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { id: 'bg-18', slug: 'sever-layt-4', name: "Север Лайт 4", article: "БГ-18", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-18/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-18/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-18.png', size: "4 × 2,4 м", area: 9.6, priceFrom: 564200, tags: [], specs: [{"label": "Размер", "value": "4 × 2,4 м"}, {"label": "Площадь застройки", "value": "9,6 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и уличная подсветка", "Абажуры и ограждение печи", "Шпросы на окнах и двери"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-19', slug: 'sever-terra-65', name: "Север Терра 6,5", article: "БГ-19", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-19/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-19/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-19.png', size: "6,5 × 2,4 м", area: 15.6, priceFrom: 698100, tags: [], specs: [{"label": "Размер", "value": "6,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "15,6 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и уличная подсветка", "Ламинация окон и двери", "Тропический душ и бойлер 50 л", "Профлист в цвете графит"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { id: 'bg-20', slug: 'sever-rezidents-7', name: "Север Резиденс 7", article: "БГ-20", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-20/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-20/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-20.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 984100, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и подсветка", "Ламинация окон и двери", "Тропический душ и бойлер 50 л", "Санузел и декоративные рейки"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { id: 'bg-21', slug: 'sever-panorama-8', name: "Север Панорама 8", article: "БГ-21", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-21/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-21/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-21.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 821600, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и подсветка", "Бойлер 50 л и обливное устройство", "Проливной пол в парной и мойке", "Декоративные рейки"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { id: 'bg-22', slug: 'istok-grafit-4', name: "Исток Графит 4", article: "БГ-22", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-22/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-22/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-22.png', size: "4 × 2,4 м", area: 9.6, priceFrom: 392600, tags: [], specs: [{"label": "Размер", "value": "4 × 2,4 м"}, {"label": "Площадь застройки", "value": "9,6 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Вывод трубы в крышу", "Ограждение печи", "Декоративные рейки", "Утепление: каменная вата 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-23', slug: 'istok-teplo-6', name: "Исток Тепло 6", article: "БГ-23", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-23/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-23/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-23.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 479700, tags: [], specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Вывод трубы в крышу", "Стеклянная дверь в парной", "Проливной пол в мойке", "Утепление: каменная вата 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-24', slug: 'istok-stil-7', name: "Исток Стиль 7", article: "БГ-24", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/NEW-SITE-BANI/images/catalog/bg-24/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-24/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-24.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 556400, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Печь Ермак 12", "Стеклянная дверь в парной", "Металлическая входная дверь", "Декоративные рейки, цвет графит", "Вывод крана в мойку"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { id: 'bg-28', slug: 'barn-premium', name: "Барн Премиум", article: "БГ-28", series: 'Барн', collection: 'Премиум', subtitle: "Гостиная, душевая, парная и крытое крыльцо. Флагманское исполнение для загородного отдыха.", description: "Гостиная, душевая, парная и крытое крыльцо. Флагманское исполнение для загородного отдыха.", image: "/NEW-SITE-BANI/images/catalog/bg-28/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-28/model.png", "/NEW-SITE-BANI/images/catalog/bg-28/owner-render.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-28.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 1380000, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Чугунная печь ЭТНА 18 и бак 30 л", "Душевая кабина и бойлер 50 л", "Скрытая электрика и сантехника", "Утепление 100 мм", "Масло на полках и полах парной"], interiorImages: ["/NEW-SITE-BANI/images/gallery/barn-premium/image1.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image2.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image3.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image4.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image5.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image6.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image7.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image8.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image9.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image10.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image11.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image12.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image13.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image14.jpeg", "/NEW-SITE-BANI/images/gallery/barn-premium/image15.jpeg"], hasBathroom: false, hasTerrace: true, hasShower: true },
]

export const homes: Home[] = [
  { id: 'bg-25', slug: 'usadba-praktik', name: "Усадьба Практик", article: "БГ-25", subtitle: "Баня с дополнительным хозяйственным модулем.", description: "Баня с дополнительным хозяйственным модулем.", image: "/NEW-SITE-BANI/images/catalog/bg-25/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-25/model.png"], size: "7 × 4,6 м", area: 32.2, priceFrom: 1475500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 4,6 м"}, {"label": "Площадь застройки", "value": "32,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Двухмодульный формат", "Планировка и комплектация согласуются при заказе"] },
  { id: 'bg-26', slug: 'usadba-prostor', name: "Усадьба Простор", article: "БГ-26", subtitle: "Баня в широком двухмодульном формате.", description: "Баня в широком двухмодульном формате.", image: "/NEW-SITE-BANI/images/catalog/bg-26/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-26/model.png"], size: "7 × 4,6 м", area: 32.2, priceFrom: 1328600, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 4,6 м"}, {"label": "Площадь застройки", "value": "32,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Двухмодульный формат", "Планировка и комплектация согласуются при заказе"] },
  { id: 'bg-27', slug: 'usadba-veranda', name: "Усадьба Веранда", article: "БГ-27", subtitle: "Баня с верандой для отдыха на открытом воздухе.", description: "Баня с верандой для отдыха на открытом воздухе.", image: "/NEW-SITE-BANI/images/catalog/bg-27/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-27/model.png"], size: "7 × 4,6 м", area: 32.2, priceFrom: 1657500, tags: [], isPopular: false, specs: [{"label": "Размер", "value": "7 × 4,6 м"}, {"label": "Площадь застройки", "value": "32,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Двухмодульный формат", "Планировка и комплектация согласуются при заказе"] },
  { id: 'bg-29', slug: 'usadba-uyt-5', name: "Усадьба Уют 5", article: "БГ-29", subtitle: "Компактная баня широкого формата. Площадь застройки 22,5 м²", description: "Компактная баня широкого формата. Площадь застройки 22,5 м²", image: "/NEW-SITE-BANI/images/catalog/bg-29/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-29/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-29.jpg', size: "4,5 × 5 м", area: 22.5, priceFrom: 1196000, priceVariants: ["Каркас 150 мм: 1 235 000 ₽", "Брус: 1 235 000 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4,5 × 5 м"}, {"label": "Площадь застройки", "value": "22,5 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная, моечная и санузел", "Комната отдыха"] },
  { id: 'bg-30', slug: 'usadba-semejnaya-6', name: "Усадьба Семейная 6", article: "БГ-30", subtitle: "Больше места для отдыха после парной. Площадь застройки 27 м²", description: "Больше места для отдыха после парной. Площадь застройки 27 м²", image: "/NEW-SITE-BANI/images/catalog/bg-30/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-30/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-30.jpg', size: "4,5 × 6 м", area: 27.0, priceFrom: 1345500, priceVariants: ["Брус: 1 384 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4,5 × 6 м"}, {"label": "Площадь застройки", "value": "27,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная, моечная и санузел", "Комната отдыха"] },
  { id: 'bg-31', slug: 'usadba-terra-7', name: "Усадьба Терра 7", article: "БГ-31", subtitle: "Крытая терраса для отдыха на воздухе. Площадь застройки 31,5 м² с террасой", description: "Крытая терраса для отдыха на воздухе. Площадь застройки 31,5 м² с террасой", image: "/NEW-SITE-BANI/images/catalog/bg-31/model.png", images: ["/NEW-SITE-BANI/images/catalog/bg-31/model.png"], floorPlan: '/NEW-SITE-BANI/images/plans/bg-31.jpg', size: "4,5 × 7 м", area: 31.5, priceFrom: 1436500, priceVariants: ["Каркас 150 мм: 1 449 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4,5 × 7 м"}, {"label": "Площадь застройки", "value": "31,5 м²"}, {"label": "Исполнение", "value": "Исполнение из бруса"}], features: ["Парная, моечная и санузел", "Комната отдыха"] },
]

export const articles: Article[] = [
  {
    "id": "word-01",
    "slug": "kak-vybrat-drevesinu-dlya-mobilnoy-bani",
    "title": "Как выбрать древесину для мобильной бани: сухая строганая доска, влажность, сорт и сечение",
    "seoTitle": "Как выбрать древесину для мобильной бани: сухая строганая доска, влажность, сорт и сечение",
    "metaDescription": "Какую древесину использовать для каркаса мобильной бани: почему важны камерная сушка и строгание, какая влажность нужна, как оценивать сучки, геометрию и сечение доски.",
    "excerpt": "Каркас хорошей мобильной бани начинается не с красивой вагонки, а с правильно выбранного пиломатериала. Ошибка на этом этапе потом проявляется перекосами, щелями, «винтом» стоек, проблемами с дверями и окнами и лишней нагрузкой на отделку.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 3,
    "content": "<h2 id=\"section-1\">Почему «просто обрезная доска» — слабая база для каркаса</h2>\n<p>Для ответственного каркаса нужна древесина стабильной геометрии. Обрезная доска естественной влажности может выглядеть ровной в день покупки, но после высыхания изменяет размеры: ее ведет, крутит, появляются щели и трещины. Поэтому для каркасных элементов разумнее использовать высушенный пиломатериал, защищенный от повторного увлажнения при хранении. В каркасном строительстве своды правил прямо требуют применять высушенные хвойные пиломатериалы и хранить их так, чтобы они не набирали влагу снова.</p>\n<h2 id=\"section-3\">Камерная сушка и контроль влажности</h2>\n<p>Фраза «сухая доска» должна подтверждаться измерением, а не ощущением на вес. Для конструкций важна не только средняя влажность партии, но и ее равномерность: отдельные сырые доски в сухой пачке способны дать локальные деформации. Для производственного контроля удобно пользоваться калиброванным влагомером и проверять доску в нескольких точках. Целевой диапазон следует закрепить во внутреннем стандарте производства с учетом проекта и условий эксплуатации. Для сухих и нормальных условий эксплуатации строительные нормы ориентируются на существенно более низкую влажность древесины, чем у свежераспиленного материала.</p>\n<h2 id=\"section-5\">Зачем строгание и калибровка</h2>\n<p>Сухая строганая доска отличается не только гладкой поверхностью. После строгания проще контролировать точное сечение, плоскостность и прилегание элементов. Это важно для ровной стены, плотного примыкания утеплителя, мембран и листовых материалов. Для каркаса толщиной около 100 мм на практике встречаются близкие после калибровки сечения порядка 40–45 × 90–100 мм. Конкретный размер нельзя выбирать «по привычке»: он должен совпадать с проектом конкретной модели и толщиной утепления.</p>\n<h2 id=\"section-7\">Сучки: нужна ли доска «совсем без сучков»</h2>\n<p>Для несущего каркаса бессучковая хвойная доска не является обязательным требованием и была бы неоправданно дорогой. Важны сорт и характер пороков. Нельзя путать здоровый сросшийся сучок с выпадающим, гнилым или крупным краевым сучком, резко ослабляющим сечение. Отдельно отбраковывают доски с сильной кривизной, винтовой деформацией, глубокими трещинами, значительным обзолом и признаками биопоражения. А вот для видимой отделки, полков и деталей, которых касается человек, требования к внешнему виду и отсутствию дефектов значительно выше.</p>\n<h2 id=\"section-9\">Ель или сосна</h2>\n<p>Для каркаса применяются хвойные породы, чаще сосна и ель. Практически важнее не спор «какая порода лучше вообще», а качество конкретной партии: влажность, сортность, геометрия, отсутствие активной плесени и правильное хранение. В одной партии хорошая ель может быть лучше плохой сосны и наоборот.</p>\n<h2 id=\"section-11\">Как должен выглядеть входной контроль на производстве</h2>\n<p>Партия принимается не по одной верхней доске. Проверяют документы поставщика, фактическое сечение, влажность выборки, геометрию, трещины, сучки, обзол и следы плесени. Доску сразу сортируют: каркас, второстепенные детали, отделка или брак. После приемки материал должен храниться на прокладках, под крышей или защитным навесом, с вентиляцией и без контакта с грунтом.</p>\n<h3 id=\"section-13\">Факт-чек / опорные источники</h3>\n<p>СП 31-105-2002; СП 64.13330.2017; ГОСТ 8486-86; ГОСТ 24454-80; ГОСТ Р 72565-2026.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Почему «просто обрезная доска» — слабая база для каркаса",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Камерная сушка и контроль влажности",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Зачем строгание и калибровка",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Сучки: нужна ли доска «совсем без сучков»",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Ель или сосна",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Как должен выглядеть входной контроль на производстве",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Фото влагомера на доске; сравнение сырой обрезной и сухой строганой доски; схема типового сечения; фото дефектов «можно/нельзя».",
    "relatedSlugs": [
      "obrabotka-drevesiny-neomid-v-bane",
      "pirog-steny-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Каталог бань"
      }
    ]
  },
  {
    "id": "word-02",
    "slug": "obrabotka-drevesiny-neomid-v-bane",
    "title": "Чем обрабатывать древесину в бане: NEOMID 200, 400, 440, 430, 433, 445 и 450-1 без путаницы",
    "seoTitle": "Чем обрабатывать древесину в бане: NEOMID 200, 400, 440, 430, 433, 445 и 450-1 без путаницы",
    "metaDescription": "Разбираем антисептики и огнебиозащиту NEOMID для мобильной бани: что применять в парной, каркасе, лагах и снаружи, как наносить и почему цвет не доказывает качество обработки.",
    "excerpt": "Обработка древесины — не один универсальный «антисептик на все случаи». В одной бане есть сухие внутренние поверхности, влажная парная, скрытый каркас, лаги, наружные детали и зоны, где дополнительно требуется огнезащита. Поэтому состав выбирают по условиям работы элемента, а не только по цене или цвету.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 3,
    "content": "<h2 id=\"section-1\">Главный принцип: сначала определить, где работает древесина</h2>\n<p>Для полков и внутренней части парной нужен состав, рассчитанный именно на повышенную влажность и перепады температуры. Для скрытого каркаса в умеренных условиях подходит другой тип защиты. Для лаг, черных полов и деталей, которые могут долго контактировать с влагой, нужна более стойкая, невымываемая защита. Огнезащита — отдельная задача и должна применяться только в совместимой системе.</p>\n<h2 id=\"section-3\">NEOMID 200 — для бань и саун</h2>\n<p>NEOMID 200 производитель позиционирует для внутренних работ в банях и саунах, включая строганые и пиленые поверхности, полки и скамейки. Он бесцветный и не должен менять естественный цвет древесины. Это хороший пример того, почему прозрачная древесина после обработки вовсе не означает отсутствие биозащиты.</p>\n<h2 id=\"section-5\">NEOMID 400 и 440: внутренние и умеренные условия</h2>\n<p>NEOMID 400 предназначен для внутренних работ и также бесцветный. NEOMID 440 рассчитан на внутренние и наружные поверхности в умеренных условиях; снаружи производитель рекомендует финишное покрытие. Оба состава совместимы с последующей отделкой, а 400 и 440 у производителя указаны как совместимые с огнезащитными пропитками.</p>\n<h2 id=\"section-7\">NEOMID 430 и 433: тяжелые условия</h2>\n<p>NEOMID 430 ECO и NEOMID 433 относятся к невымываемой защите для тяжелых условий. Их логично рассматривать для лаг, черных полов, элементов каркаса и других участков, где возможен длительный контакт с влагой. Важно: у разных составов различается совместимость с дальнейшей огнезащитой. Например, производитель отдельно предупреждает, что NEOMID 433 с огнезащитными пропитками не совместим. Нельзя просто «сложить» два средства в произвольной последовательности.</p>\n<h2 id=\"section-9\">NEOMID 445 — не просто антисептик, а декоративная защита</h2>\n<p>NEOMID 445 — тонирующий невымываемый антисептик для наружных и внутренних работ в тяжелых условиях. Его задача сочетает защиту и цвет. Такой состав уместен там, где внешний вид поверхности должен быть частью финишного решения.</p>\n<h2 id=\"section-11\">NEOMID 450-1 — огнебиозащита</h2>\n<p>NEOMID 450-1 — огнебиозащитная пропитка. Производитель выпускает ее в красном варианте для визуального контроля нанесения и в бесцветном. Поэтому красный цвет — это не «признак настоящей обработки», а всего лишь возможный индикатор конкретного состава. Бесцветная обработка может быть полноценной и технологически правильной.</p>\n<h2 id=\"section-13\">Как наносить</h2>\n<p>Способ нанесения выбирают по техническому листу конкретного продукта. Для многих составов допустимы кисть, валик или распыление; для некоторых предусмотрена глубинная пропитка. Поверхность должна быть очищена, а температура, расход, число слоев и время фиксации должны соответствовать инструкции. Слой «для галочки» с недостаточным расходом не дает заявленной защиты. Перед закрытием конструкции древесина должна высохнуть.</p>\n<h2 id=\"section-15\">Почему дешево не всегда выгодно</h2>\n<p>Сравнивать защитные составы только по цене канистры неправильно. Важны концентрация, расход рабочего раствора, класс условий эксплуатации, срок фиксации, возможность последующей окраски и совместимость с огнезащитой. Самый дешевый состав может оказаться дороже, если его приходится чаще обновлять или он не подходит для нужной зоны.</p>\n<h2 id=\"section-17\">Что фиксировать в производственном стандарте</h2>\n<p>Для каждой детали полезно иметь карту: зона применения, состав, концентрация, способ нанесения, расчетный расход, число слоев, время сушки и финишное покрытие. Это превращает «мы обрабатываем древесину» в проверяемый технологический процесс.</p>\n<h3 id=\"section-19\">Факт-чек / опорные источники</h3>\n<p>Официальные карточки NEOMID 200, 400, 430 ECO, 433, 440, 445, 450-1; официальный раздел FAQ NEOMID.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Главный принцип: сначала определить, где работает древесина",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "NEOMID 200 — для бань и саун",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "NEOMID 400 и 440: внутренние и умеренные условия",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "NEOMID 430 и 433: тяжелые условия",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "NEOMID 445 — не просто антисептик, а декоративная защита",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "NEOMID 450-1 — огнебиозащита",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Как наносить",
        "level": 2
      },
      {
        "id": "section-15",
        "title": "Почему дешево не всегда выгодно",
        "level": 2
      },
      {
        "id": "section-17",
        "title": "Что фиксировать в производственном стандарте",
        "level": 2
      },
      {
        "id": "section-19",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Схема бани с зонами и подходящими типами защиты; таблица NEOMID по назначению; фото бесцветной и красной огнебиозащиты; фото нанесения распылением/кистью.",
    "relatedSlugs": [
      "kak-vybrat-drevesinu-dlya-mobilnoy-bani",
      "dymohod-v-derevyannoy-bane",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-03",
    "slug": "materialy-dlya-mobilnoy-bani",
    "title": "Из чего на самом деле состоит мобильная баня: утеплитель, мембраны, крепеж, кровля и отделка",
    "seoTitle": "Из чего на самом деле состоит мобильная баня: утеплитель, мембраны, крепеж, кровля и отделка",
    "metaDescription": "Подробно о материалах мобильной бани: каркас, утеплитель, пароизоляция, ветрозащита, фольга, крепеж, кровля, окна, двери и внутренняя отделка.",
    "excerpt": "Покупатель часто видит только фасад, вагонку и печь. Но долговечность бани определяется скрытыми слоями: качеством каркаса, правильным утеплителем, герметичной пароизоляцией, крепежом и тем, как эти материалы собраны в единую конструкцию.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Каркас и несущие элементы</h2>\n<p>Основой служит высушенная древесина проектного сечения. В каталоге BANGER для базовых серий предусмотрены каркасные исполнения около 100 мм и варианты из бруса. Для статьи на сайте важно показывать не только цифру толщины, но и реальный разрез стены: стойка, утеплитель, внутренний парозащитный слой, наружная защита и отделка.</p>\n<h2 id=\"section-3\">Утеплитель</h2>\n<p>Для деревянного каркаса важны стабильность размеров, негорючесть или корректный класс пожарной опасности, отсутствие щелей и соответствие толщины проекту. Качество укладки зачастую важнее громкого бренда: мостики холода появляются именно в зазорах, смятых матах и участках вокруг проемов.</p>\n<h2 id=\"section-5\">Пароизоляция и защита от влаги</h2>\n<p>Влажный воздух из парной стремится проникнуть в конструкцию. Поэтому внутренний слой должен ограничивать пароперенос, а узлы и стыки — быть герметичными. В парной часто применяют фольгированный слой как часть парозащитного решения; его польза исчезает, если стыки, проходки и примыкания сделаны небрежно.</p>\n<h2 id=\"section-7\">Ветрозащита и вентиляционный зазор</h2>\n<p>С наружной стороны утеплитель защищают от продувания и атмосферной влаги. Между фасадной облицовкой и защитным слоем обычно предусматривают возможность высыхания конструкции. Закрытая «бутербродом» мокрая древесина — плохой сценарий даже при дорогих материалах.</p>\n<h2 id=\"section-9\">Крепеж</h2>\n<p>Во влажных зонах важен коррозионно-стойкий крепеж. Обычный черный саморез в месте постоянной влаги может ржаветь, давать потеки и терять прочность. Для разных узлов применяются разные типы крепежа — конструкционные саморезы, гвозди, уголки, анкеры, нержавеющий крепеж для отделки.</p>\n<h2 id=\"section-11\">Отделка, окна, двери и кровля</h2>\n<p>Отделочные материалы должны соответствовать зоне применения. Для парной важны низкая теплопроводность и отсутствие смоляных карманов на контактных поверхностях. Окна и двери должны выдерживать влажность и перепады температур. Кровля и наружная отделка должны не только красиво выглядеть, но и защищать конструкцию от воды, оставляя правильные пути отвода влаги.</p>\n<h3 id=\"section-13\">Факт-чек / опорные источники</h3>\n<p>СП 50.13330.2024; СП 31-105-2002; каталог BANGER.SU — раздел материалов и комплектации.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Каркас и несущие элементы",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Утеплитель",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Пароизоляция и защита от влаги",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Ветрозащита и вентиляционный зазор",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Крепеж",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Отделка, окна, двери и кровля",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Взрыв-схема стены; образцы утеплителя и мембран; узел вентзазора; разные виды крепежа.",
    "relatedSlugs": [
      "pirog-steny-mobilnoy-bani",
      "otdelka-parnoy-i-polki",
      "fasad-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/komplektaciya",
        "label": "Комплектация и опции"
      }
    ]
  },
  {
    "id": "word-04",
    "slug": "podgotovka-ploshchadki-pod-mobilnuyu-banyu",
    "title": "Как подготовить площадку под мобильную баню: участок, подъезд, дренаж и место для монтажа",
    "seoTitle": "Как подготовить площадку под мобильную баню: участок, подъезд, дренаж и место для монтажа",
    "metaDescription": "Пошаговая подготовка участка к доставке мобильной бани: выбор места, подъезд техники, перепад высот, дренаж, фундамент и коммуникации.",
    "excerpt": "Мобильная баня приезжает готовым крупным модулем, поэтому участок нужно готовить не только под саму баню, но и под ее доставку. Самая частая ошибка — сделать фундамент, а потом обнаружить, что манипулятору негде встать, ветки мешают стреле, а вода после дождя собирается под полом.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Начните с логистики, а не с фундамента</h2>\n<p>До работ на участке уточняют размеры модуля, массу, тип машины, требуемую зону для работы стрелы или крана, ширину ворот, радиусы поворотов, провода над дорогой, деревья и уклон подъезда. Отдельно оценивают, выдержит ли покрытие тяжелую технику после дождя.</p>\n<h2 id=\"section-3\">Выберите сухое место и продумайте воду</h2>\n<p>Площадка не должна быть низиной, куда стекает вода с участка. Полезно заранее сформировать уклон поверхности от бани, продумать водоотвод и не засыпать продухи или пространство под модулем. Наличие свай само по себе не исправляет постоянное заболачивание.</p>\n<h2 id=\"section-5\">Перепад высот</h2>\n<p>Небольшой уклон участка можно компенсировать фундаментом, но сильный перепад влияет на длину свай, жесткость обвязки, высоту входной лестницы и внешний вид. Поэтому геодезическая или хотя бы качественная нивелировка до заказа фундамента экономит деньги.</p>\n<h2 id=\"section-7\">Коммуникации</h2>\n<p>До монтажа определяют точки ввода электричества, воды и канализации. Труба, выведенная «примерно там», после установки может оказаться под балкой. Схема выводов должна привязываться к конкретной планировке и быть согласована до изготовления.</p>\n<h2 id=\"section-9\">Рабочая зона монтажа</h2>\n<p>В день доставки возле фундамента не должны лежать стройматериалы, стоять автомобили или временные заборы. Отдельно обеспечивают место для безопасной работы монтажников и техники. Если баня ставится вплотную к существующему зданию, заранее проверяют возможность монтажа наружных элементов и обслуживания фасада.</p>\n<h2 id=\"section-11\">Что подготовить к дню доставки</h2>\n<p>Готовый и проверенный фундамент; свободный подъезд; убранные ветки и препятствия; подтвержденные отметки высоты; точки коммуникаций; ответственное лицо на объекте. Такой чек-лист должен выдаваться клиенту сразу после заказа, а не за день до машины.</p>\n<h3 id=\"section-13\">Факт-чек / опорные источники</h3>\n<p>Практика монтажа модульных зданий; требования проекта конкретной модели и инструкции перевозчика/монтажной бригады.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Начните с логистики, а не с фундамента",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Выберите сухое место и продумайте воду",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Перепад высот",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Коммуникации",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Рабочая зона монтажа",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Что подготовить к дню доставки",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Схема участка сверху; безопасная зона для манипулятора; фото хорошего и плохого водоотвода; чек-лист подготовки.",
    "relatedSlugs": [
      "fundament-dlya-mobilnoy-bani-bloki-ili-svai",
      "dostavka-i-ustanovka-mobilnoy-bani",
      "voda-i-boyler-v-mobilnoy-bane",
      "elektrika-v-bane"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-05",
    "slug": "fundament-dlya-mobilnoy-bani-bloki-ili-svai",
    "title": "Блоки или винтовые сваи под мобильную баню: как выбирать и почему нельзя считать «по длине»",
    "seoTitle": "Блоки или винтовые сваи под мобильную баню: как выбирать и почему нельзя считать «по длине»",
    "metaDescription": "Как выбрать фундамент для мобильной бани: блоки и винтовые сваи, расчет нагрузки, грунт, схема опор и типичные ошибки.",
    "excerpt": "Вопрос «сколько свай нужно на баню 2,4 × 4 м» кажется простым, но правильного универсального ответа нет. Количество опор зависит не только от длины модуля, а от его массы, расположения несущих линий, печи и перегородок, грунта, несущей способности конкретной сваи и схемы ростверка.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Когда возможны фундаментные блоки</h2>\n<p>Опоры из блоков могут быть рациональны на ровной, устойчивой, хорошо дренированной площадке для легкого модуля, когда проект допускает такую схему. Основание под каждый блок должно быть подготовлено, высоты выведены в один уровень, а опоры размещены под расчетными точками несущей обвязки. Ставить блоки просто на растительный слой нельзя: он неоднороден, намокает и дает осадку.</p>\n<h2 id=\"section-3\">Когда удобнее винтовые сваи</h2>\n<p>Винтовые сваи часто выбирают при уклоне участка, сложном рельефе, необходимости поднять модуль выше земли или при грунтах, где поверхностные блоки дают непредсказуемую осадку. Но слово «свая» не отменяет расчета: диаметр лопасти, длина, металл, глубина и несущая способность зависят от грунта и нагрузок.</p>\n<h2 id=\"section-5\">Как считается количество опор</h2>\n<p>Сначала определяют расчетные нагрузки от самого модуля, людей, оборудования и климатических воздействий. Затем оценивают несущую способность основания и каждой сваи. После этого сваи раскладывают так, чтобы нагрузки передавались через несущие балки и ростверк без опасных пролетов и кручения. Нормы по свайным фундаментам требуют проверять нагрузку на сваю в составе всего фундамента, а не назначать число свай только из площади здания.</p>\n<h2 id=\"section-7\">Почему правило «4 метра — 4 сваи» опасно</h2>\n<p>Четыре опоры по углам могут быть достаточны для одного легкого проекта и абсолютно недостаточны для другого. Если внутри есть тяжелая печь, центральная несущая линия, длинный пролет или два модуля, схема меняется. Поэтому в статье лучше показывать иллюстративные сетки — 2×2, 2×3, 3×3 — но прямо подписывать: это не готовый расчет, а примеры компоновки.</p>\n<h2 id=\"section-9\">Что проверять после монтажа свай</h2>\n<p>Отметки оголовков, вертикальность, качество сварки, защиту металла, соответствие проектной схеме и диагонали. После установки модуля нужно убедиться, что обвязка опирается на предусмотренные точки, а не «висит» между ними.</p>\n<h2 id=\"section-11\">Практический вывод</h2>\n<p>Фундамент выбирают под конкретную баню и конкретный участок. На сайте полезно дать клиенту понятную схему принятия решения и форму для предварительного расчета, но окончательное количество свай должно подтверждаться проектом и данными по грунту.</p>\n<h3 id=\"section-13\">Факт-чек / опорные источники</h3>\n<p>СП 24.13330.2021 (редакция с изменениями); проект конкретной модели; данные по грунту/испытаниям и характеристикам свай.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Когда возможны фундаментные блоки",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Когда удобнее винтовые сваи",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Как считается количество опор",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Почему правило «4 метра — 4 сваи» опасно",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Что проверять после монтажа свай",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Практический вывод",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Сравнение блоков и свай; схемы сеток опор с пометкой «пример»; формула нагрузки как инфографика; фото оголовков.",
    "relatedSlugs": [
      "podgotovka-ploshchadki-pod-mobilnuyu-banyu",
      "dostavka-i-ustanovka-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Каталог бань"
      }
    ]
  },
  {
    "id": "word-06",
    "slug": "karkas-ili-brus-dlya-bani",
    "title": "Каркасная баня или баня из бруса: что отличается в реальной эксплуатации",
    "seoTitle": "Каркасная баня или баня из бруса: что отличается в реальной эксплуатации",
    "metaDescription": "Сравнение мобильной бани из каркаса и бруса: вес, усадка, утепление, скорость прогрева, ремонт и особенности эксплуатации.",
    "excerpt": "Каркас и брус — не «хорошо против плохо», а разные конструктивные системы. Правильный выбор зависит от ожиданий владельца, режима использования и того, насколько качественно выполнены узлы.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Каркас</h2>\n<p>Каркасная система позволяет точно управлять утеплением и толщиной стены, имеет сравнительно небольшой вес и удобна для заводской сборки. Критические места — качество пиломатериала, герметичность парозащиты, отсутствие щелей в утеплении и правильная наружная защита.</p>\n<h2 id=\"section-3\">Брус</h2>\n<p>Брус формирует стену самим массивом древесины. Он дает другой внешний вид и ощущение материала, но сильнее зависит от влажности, усушки и качества соединений. Подвижки древесины после изготовления нужно учитывать в проемах, отделке и инженерных узлах.</p>\n<h2 id=\"section-5\">Тепло и прогрев</h2>\n<p>Температурное ощущение определяется не названием технологии, а всей оболочкой: сопротивлением теплопередаче, герметичностью, полом, потолком, окнами и вентиляцией. Хорошо утепленная каркасная баня может быстро прогреваться; массивный брус имеет большую тепловую инерцию.</p>\n<h2 id=\"section-7\">Вес и фундамент</h2>\n<p>Каркасное исполнение обычно легче, но фундамент все равно рассчитывается по фактической массе и схеме нагрузок. Для тяжелого модуля из бруса особенно важно не использовать «универсальную» схему опор.</p>\n<h2 id=\"section-9\">Что спросить у производителя</h2>\n<p>Какая влажность материала, какое сечение стен, как выполнена пароизоляция, где проходит вентзазор, чем обработаны скрытые элементы, как компенсируются подвижки бруса. Эти ответы важнее рекламного слова «премиум».</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>СП 31-105-2002; СП 64.13330.2017; каталог BANGER.SU по вариантам каркас/брус.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Каркас",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Брус",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Тепло и прогрев",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Вес и фундамент",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Что спросить у производителя",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Два разреза стены — каркас и брус; сравнение массы/усадки/ремонтопригодности.",
    "relatedSlugs": [
      "kak-vybrat-drevesinu-dlya-mobilnoy-bani",
      "fundament-dlya-mobilnoy-bani-bloki-ili-svai",
      "uteplenie-mobilnoy-bani-dlya-zimy"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-07",
    "slug": "pirog-steny-mobilnoy-bani",
    "title": "Правильный пирог стены мобильной бани: куда ставить утеплитель, пароизоляцию и вентзазор",
    "seoTitle": "Правильный пирог стены мобильной бани: куда ставить утеплитель, пароизоляцию и вентзазор",
    "metaDescription": "Как устроена стена мобильной бани: утеплитель, пароизоляция, фольга, ветрозащита и вентзазор. Объясняем, как избежать конденсата.",
    "excerpt": "В бане влага движется через конструкции гораздо интенсивнее, чем в обычной сухой комнате. Поэтому «пирог» стены должен не только удерживать тепло, но и управлять паром и возможностью высыхания материалов.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Изнутри — ограничить пар</h2>\n<p>Со стороны теплого и влажного помещения нужен слой с высоким сопротивлением паропроницанию. В парной эту функцию часто выполняет фольгированная пароизоляция. Сам материал важен, но еще важнее непрерывность контура: проклейка швов, герметизация проходок и примыканий.</p>\n<h2 id=\"section-3\">Внутри каркаса — утеплитель без щелей</h2>\n<p>Маты должны заполнять ячейку, не сползать и не быть сильно смятыми. Щель у стойки превращается в локальный мост холода, где может конденсироваться влага.</p>\n<h2 id=\"section-5\">Снаружи — защита от ветра и возможность высыхания</h2>\n<p>Наружный слой защищает утеплитель от продувания и капельной влаги, но конструкция должна иметь рассчитанный путь высыхания наружу. За фасадной облицовкой обычно нужен вентиляционный зазор.</p>\n<h2 id=\"section-7\">Почему нельзя копировать один пирог для всех зон</h2>\n<p>Стена парной, стены комнаты отдыха, пол и потолок работают в разных условиях. Особенно нагружены потолок парной и места вокруг печи и дымохода. Для них нужны отдельные узлы.</p>\n<h2 id=\"section-9\">Как показать качество клиенту</h2>\n<p>На сайте полезно сделать интерактивный разрез стены конкретной серии: каждый слой с названием, толщиной и функцией. Такой блок объясняет цену лучше, чем десять общих фраз о «теплой бане».</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>СП 50.13330.2024; СП 31-105-2002.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Изнутри — ограничить пар",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Внутри каркаса — утеплитель без щелей",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Снаружи — защита от ветра и возможность высыхания",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Почему нельзя копировать один пирог для всех зон",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Как показать качество клиенту",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Взрыв-схема стены с направлением движения пара; фото проклеенных швов; пример мостика холода.",
    "relatedSlugs": [
      "materialy-dlya-mobilnoy-bani",
      "uteplenie-mobilnoy-bani-dlya-zimy",
      "ventilyatsiya-mobilnoy-bani"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-08",
    "slug": "uteplenie-mobilnoy-bani-dlya-zimy",
    "title": "Как утеплить мобильную баню для зимы: стены, пол, потолок и слабые места",
    "seoTitle": "Как утеплить мобильную баню для зимы: стены, пол, потолок и слабые места",
    "metaDescription": "Что влияет на зимнюю эксплуатацию мобильной бани: толщина утепления, потолок, пол, окна, двери, герметичность и вентиляция.",
    "excerpt": "Зимняя баня — это не просто «100 мм утеплителя». На скорость прогрева и расход дров влияют все ограждающие конструкции, а слабое место часто оказывается не в стене, а в полу, потолке, двери или негерметичном узле.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Потолок особенно важен</h2>\n<p>Теплый воздух поднимается, поэтому ошибки в потолке быстро ощущаются. Нужна непрерывная парозащита, полноценное утепление и аккуратное выполнение прохода дымохода.</p>\n<h2 id=\"section-3\">Пол</h2>\n<p>Пол одновременно контактирует с холодным подпольем и влагой из мойки. Утеплитель должен быть защищен от намокания, а слив — не создавать открытую холодную дыру в помещение.</p>\n<h2 id=\"section-5\">Окна и двери</h2>\n<p>Большая панорама улучшает вид, но увеличивает теплопотери. Важно качество стеклопакета, монтаж, герметичность притвора и отсутствие продувания.</p>\n<h2 id=\"section-7\">Герметичность важнее лишних сантиметров</h2>\n<p>Дополнительные 50 мм утепления не спасут, если пароизоляция разорвана, дверь плохо прижата или в стене есть продуваемые щели.</p>\n<h2 id=\"section-9\">Эксплуатация</h2>\n<p>Зимой после использования баню нужно просушивать. Постоянно закрытая влажная баня быстрее получает плесень, чем хорошо проветриваемая, даже если она очень теплая.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>СП 50.13330.2024; проектные спецификации конкретной модели.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Потолок особенно важен",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Пол",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Окна и двери",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Герметичность важнее лишних сантиметров",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Эксплуатация",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Тепловая схема слабых мест; фото потолочного пирога; инфографика «что влияет на прогрев».",
    "relatedSlugs": [
      "pirog-steny-mobilnoy-bani",
      "ventilyatsiya-mobilnoy-bani",
      "okna-i-dveri-v-bane"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-09",
    "slug": "pol-i-sliv-v-bane",
    "title": "Пол и слив в бане: как сделать мойку, чтобы вода уходила, а конструкция не гнила",
    "seoTitle": "Пол и слив в бане: как сделать мойку, чтобы вода уходила, а конструкция не гнила",
    "metaDescription": "Устройство пола и слива в мобильной бане: уклон, трап, гидроизоляция, проливной пол, защита лаг и зимняя эксплуатация.",
    "excerpt": "Вода в бане должна уходить по заданному маршруту. Когда слив сделан «примерно в углу», вода остается в стыках, смачивает древесину и создает запах. Поэтому пол — один из самых инженерных узлов мобильной бани.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Сначала схема водоотведения</h2>\n<p>До отделки определяют место трапа или лотка, трассу канализации и возможность обслуживания. Для душевых нормативная практика предусматривает уклон пола порядка 1–2% в сторону лотка или трапа.</p>\n<h2 id=\"section-3\">Гидроизоляция</h2>\n<p>В мокрых зонах вода не должна попадать в утеплитель и деревянную конструкцию. Важны примыкания к стенам, проходы труб и место установки трапа.</p>\n<h2 id=\"section-5\">Проливной и герметичный пол</h2>\n<p>Проливной пол проще по идее, но требует продуманного подполья, отвода воды и морозостойкости. Герметичная система с трапом комфортнее контролируется, но чувствительна к качеству гидроизоляции и уклонов.</p>\n<h2 id=\"section-7\">Лаги и черные полы</h2>\n<p>Скрытые деревянные элементы в зоне повышенного риска должны быть сухими до закрытия и защищены составом, подходящим для тяжелых условий. При этом нельзя нарушать совместимость защитных систем.</p>\n<h2 id=\"section-9\">Зима</h2>\n<p>Нужно исключить участки, где вода остается и замерзает: сифоны, горизонтальные карманы, неутепленные трубы. Для сезонной эксплуатации должна быть понятная процедура слива системы.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>СП 30.13330.2020, п. 17.9–17.10; инструкции производителей систем гидроизоляции.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Сначала схема водоотведения",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Гидроизоляция",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Проливной и герметичный пол",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Лаги и черные полы",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Зима",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Разрез пола с трапом; схема уклона 1–2%; узел гидроизоляции; фото защищенных лаг.",
    "relatedSlugs": [
      "obrabotka-drevesiny-neomid-v-bane",
      "voda-i-boyler-v-mobilnoy-bane",
      "uteplenie-mobilnoy-bani-dlya-zimy"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-10",
    "slug": "ventilyatsiya-mobilnoy-bani",
    "title": "Вентиляция бани: как получить хороший пар и быстро высушить помещение после использования",
    "seoTitle": "Вентиляция бани: как получить хороший пар и быстро высушить помещение после использования",
    "metaDescription": "Зачем вентиляция в парной, мойке и комнате отдыха, где делать приток и вытяжку и почему сушить баню нужно после каждого использования.",
    "excerpt": "Вентиляция решает две разные задачи: во время парения обеспечивает комфорт и управляемый воздухообмен, а после — удаляет влагу. Если помнить только о первой задаче, даже красивая новая баня долго остается сырой.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Приток и вытяжка должны работать вместе</h2>\n<p>Одна решетка без пути движения воздуха не дает стабильного воздухообмена. Важно понимать, откуда приходит свежий воздух, куда он проходит и где удаляется.</p>\n<h2 id=\"section-3\">Связь с печью</h2>\n<p>Для дровяной печи нужен воздух для горения. Положение приточного канала и печи влияет на тягу и распределение температуры. Универсальная картинка из интернета не заменяет схему для конкретной печи.</p>\n<h2 id=\"section-5\">Сушка после парения</h2>\n<p>После использования открывают предусмотренные каналы, удаляют воду с пола, просушивают полки и помещение. Режим сушки должен быть простым, чтобы владелец реально им пользовался.</p>\n<h2 id=\"section-7\">Мойка и комната отдыха</h2>\n<p>В мойке важно удалять водяной пар, а в комнате отдыха — не допускать постоянного переноса влажного воздуха в холодные конструкции. В многокомнатной бане потоки воздуха нужно рассматривать как систему.</p>\n<h2 id=\"section-9\">Что показать клиенту</h2>\n<p>В карточке модели полезно рисовать схему вентиляции конкретной планировки и указывать, какие заслонки нужно открыть во время парения и после него.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>Проект вентиляции конкретной модели, требования производителя печи и действующие нормы по вентиляции/пожарной безопасности.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Приток и вытяжка должны работать вместе",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Связь с печью",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Сушка после парения",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Мойка и комната отдыха",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Что показать клиенту",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Схема потоков воздуха; режим «паримся/сушим»; фото регулируемой вентиляционной решетки.",
    "relatedSlugs": [
      "kak-vybrat-pech-dlya-mobilnoy-bani",
      "uteplenie-mobilnoy-bani-dlya-zimy",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-11",
    "slug": "kak-vybrat-pech-dlya-mobilnoy-bani",
    "title": "Как выбрать печь для мобильной бани: объем парной, мощность, камни и режим парения",
    "seoTitle": "Как выбрать печь для мобильной бани: объем парной, мощность, камни и режим парения",
    "metaDescription": "Подбор банной печи по объему парной, стеклянным поверхностям, утеплению и режиму использования. Что важнее паспортных киловатт.",
    "excerpt": "Печь должна соответствовать не длине всей бани, а тепловой нагрузке парной. Слишком слабая будет постоянно работать на пределе, а слишком мощная быстро перегреет воздух, не успевая равномерно прогреть камни и поверхности.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Считают парную</h2>\n<p>Основа подбора — внутренний объем парной с поправками на стеклянные двери, окна, холодные поверхности и качество утепления. Рабочий диапазон всегда сверяют с паспортом конкретной печи.</p>\n<h2 id=\"section-3\">Дровяная печь</h2>\n<p>Важны объем топки, способ загрузки, масса камней, материал печи, наличие выносной топки и удобство обслуживания. Не стоит выбирать только по внешнему виду.</p>\n<h2 id=\"section-5\">Камни</h2>\n<p>Количество и фракция камней должны соответствовать каменке. Слишком плотная неправильная укладка ухудшает циркуляцию воздуха, а неподходящий камень может разрушаться от циклов нагрева.</p>\n<h2 id=\"section-7\">Безопасность</h2>\n<p>Печь устанавливают с учетом паспорта производителя, защитных экранов, основания и дымохода. Заводские требования по расстояниям имеют приоритет для конкретного изделия в пределах норм.</p>\n<h2 id=\"section-9\">Как сравнивать модели</h2>\n<p>На сайте лучше показывать не просто название печи, а диапазон объема парной, массу камней, материал, тип топки и возможные опции.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>Паспорта производителей печей; СП 7.13130.2013 в действующей редакции.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Считают парную",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Дровяная печь",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Камни",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Безопасность",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Как сравнивать модели",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Калькулятор объема парной; схема факторов выбора; фото печи с экраном.",
    "relatedSlugs": [
      "dymohod-v-derevyannoy-bane",
      "ventilyatsiya-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/komplektaciya",
        "label": "Комплектация и опции"
      }
    ]
  },
  {
    "id": "word-12",
    "slug": "dymohod-v-derevyannoy-bane",
    "title": "Дымоход в деревянной бане: проход через потолок и кровлю без опасных сокращений",
    "seoTitle": "Дымоход в деревянной бане: проход через потолок и кровлю без опасных сокращений",
    "metaDescription": "Как устроить дымоход в мобильной бане: проходные узлы, разделки, отступки, негорючие материалы и требования производителя печи.",
    "excerpt": "Самый опасный способ сэкономить в бане — сократить расстояния вокруг печи и дымохода. Дерево может перегреваться годами без открытого огня, а затем воспламениться. Поэтому узел прохода должен быть рассчитан и доступен для контроля.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Нормы и паспорт печи работают вместе</h2>\n<p>СП по пожарной безопасности задает размеры разделок и отступок, а для заводских печей и дымовых каналов нужно учитывать документацию изготовителя. Нельзя брать одно универсальное расстояние для всех систем.</p>\n<h2 id=\"section-3\">Проход через перекрытие</h2>\n<p>В месте пересечения деревянного потолка нужна разделка с негорючим заполнением. Действующие правила требуют, чтобы зазоры вокруг разделок заполнялись негорючими материалами; конкретная геометрия зависит от конструкции и паспорта системы.</p>\n<h2 id=\"section-5\">Сэндвич не означает «можно вплотную»</h2>\n<p>Утепленная труба снижает температуру внешней поверхности, но не отменяет расстояния до горючих конструкций и правильный проходной узел.</p>\n<h2 id=\"section-7\">Кровля</h2>\n<p>На крыше важны герметичность прохода, высота устья относительно кровли и защита от осадков. На горючих кровлях для дровяных печей требования могут включать искроулавливание.</p>\n<h2 id=\"section-9\">Обслуживание</h2>\n<p>Дымоход должен чиститься и осматриваться. Конструкция, спрятанная намертво без доступа, усложняет безопасную эксплуатацию.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>СП 7.13130.2013, ред. 27.03.2025, приложение Б и пп. 5.12–5.17; паспорт конкретной печи и дымохода.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Нормы и паспорт печи работают вместе",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Проход через перекрытие",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Сэндвич не означает «можно вплотную»",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Кровля",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Обслуживание",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Разрез проходного узла; зона отступки; фото правильного и неправильного монтажа.",
    "relatedSlugs": [
      "kak-vybrat-pech-dlya-mobilnoy-bani",
      "obrabotka-drevesiny-neomid-v-bane",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-13",
    "slug": "elektrika-v-bane",
    "title": "Электрика в бане: кабель, свет, розетки и защита во влажных и горячих зонах",
    "seoTitle": "Электрика в бане: кабель, свет, розетки и защита во влажных и горячих зонах",
    "metaDescription": "Безопасная электрика в мобильной бане: скрытая проводка, термостойкий кабель в сауне, УЗО, зоны влажности и размещение оборудования.",
    "excerpt": "Баня одновременно сочетает дерево, высокую температуру и воду — поэтому электрика здесь требует более строгого подхода, чем в обычной комнате. Проектирование и подключение должны выполнять специалисты, а статья на сайте должна объяснять клиенту, что именно проверять.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">Проводка</h2>\n<p>ПУЭ для саун, ванных и душевых в общем случае ориентирует на скрытую электропроводку и допускает открытую прокладку кабелей, но запрещает провода с металлическими оболочками, металлические трубы и рукава в этих помещениях.</p>\n<h2 id=\"section-3\">Температура парной</h2>\n<p>В специальных зонах сауны применяются проводники с изоляцией, рассчитанной на высокую температуру. В ПУЭ для зон 3 и 4 указана допустимая температура изоляции 170 °C.</p>\n<h2 id=\"section-5\">Защита</h2>\n<p>Линии влажных помещений должны иметь корректно подобранные автоматы и устройства защитного отключения. Сечение кабеля выбирают по нагрузке и способу прокладки, а не по принципу «так всегда делаем».</p>\n<h2 id=\"section-7\">Свет и оборудование</h2>\n<p>Светильники, выключатели, розетки и блоки управления размещают с учетом зон, температуры и степени защиты оболочки. По возможности чувствительную автоматику выносят из самой горячей зоны.</p>\n<h2 id=\"section-9\">Приемка</h2>\n<p>Клиенту полезно выдавать схему групп, номиналы защитных устройств и подписи в щите. Это дешевле сделать на производстве, чем потом разбираться, какой автомат отвечает за бойлер или подсветку.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>ПУЭ, п. 7.1.40; ГОСТ Р 50571.12-96 (раздел 703); проект электроснабжения конкретной модели.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Проводка",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Температура парной",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Защита",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Свет и оборудование",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Приемка",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Схема электрических зон; щит с подписанными группами; пример термостойкого провода.",
    "relatedSlugs": [
      "dymohod-v-derevyannoy-bane",
      "voda-i-boyler-v-mobilnoy-bane"
    ],
    "resourceLinks": [
      {
        "href": "/komplektaciya",
        "label": "Комплектация и опции"
      }
    ]
  },
  {
    "id": "word-14",
    "slug": "voda-i-boyler-v-mobilnoy-bane",
    "title": "Вода, душ и бойлер в мобильной бане: как сделать систему удобной и пережить зиму",
    "seoTitle": "Вода, душ и бойлер в мобильной бане: как сделать систему удобной и пережить зиму",
    "metaDescription": "Водоснабжение мобильной бани: бойлер, душ, разводка труб, слив, замерзание и консервация системы зимой.",
    "excerpt": "Комфортный душ превращает баню из «парилки на выходные» в полноценное место отдыха. Но вода требует продуманной схемы: где ввод, как слить систему, что будет при морозе и как добраться до соединений при обслуживании.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Ввод воды</h2>\n<p>Точка ввода должна быть привязана к планировке и защищена от механических нагрузок. Наружный участок трубы на морозе требует отдельного решения — утепления, греющего кабеля или возможности полного слива.</p>\n<h2 id=\"section-3\">Бойлер</h2>\n<p>Объем выбирают по числу пользователей и сценарию использования. Важно предусмотреть электропитание нужной мощности, предохранительную арматуру и возможность технического обслуживания.</p>\n<h2 id=\"section-5\">Разводка</h2>\n<p>Чем меньше скрытых неразборных соединений в недоступных местах, тем проще ремонт. Узлы лучше группировать там, где к ним можно добраться без разбора всей стены.</p>\n<h2 id=\"section-7\">Слив и канализация</h2>\n<p>Трасса должна иметь рабочий уклон и не создавать участков застоя. Выпуск должен быть согласован с септиком, локальной канализацией или другой системой участка.</p>\n<h2 id=\"section-9\">Консервация</h2>\n<p>Для периодически отапливаемой зимней бани нужен простой алгоритм: перекрыть ввод, слить бойлер и трубопроводы, освободить сифоны или защитить их от замерзания по проекту. Если процедура слишком сложная, ей не будут пользоваться.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>СП 30.13330.2020; паспорта бойлеров и сантехнического оборудования.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Ввод воды",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Бойлер",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Разводка",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Слив и канализация",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Консервация",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Схема водоснабжения; чек-лист консервации; узел бойлера и предохранительного клапана.",
    "relatedSlugs": [
      "pol-i-sliv-v-bane",
      "elektrika-v-bane",
      "uteplenie-mobilnoy-bani-dlya-zimy"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-15",
    "slug": "otdelka-parnoy-i-polki",
    "title": "Чем отделывать парную: осина, липа, хвойная древесина и правильные полки",
    "seoTitle": "Чем отделывать парную: осина, липа, хвойная древесина и правильные полки",
    "metaDescription": "Материалы для отделки парной и полков: осина, липа, хвойные породы, сучки, смола, крепеж и защитные масла.",
    "excerpt": "Древесина в парной работает в условиях высокой температуры, влажности и прямого контакта с телом. Поэтому требования к ней отличаются от требований к скрытому каркасу.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Полки</h2>\n<p>Для полков ценят низкую теплопроводность, гладкость, отсутствие заноз, смоляных карманов и опасных дефектов. Осина — распространенный практичный вариант; в каталоге BANGER она используется для отделки парной и полков базовой серии «Исток».</p>\n<h2 id=\"section-3\">Стены и потолок</h2>\n<p>На видимых поверхностях важна стабильность геометрии и качество сортировки. Сильно смолистые участки хвойной древесины в зоне высокой температуры могут выделять смолу, поэтому материал распределяют по зонам осознанно.</p>\n<h2 id=\"section-5\">Крепеж</h2>\n<p>Металлические шляпки на поверхности полка могут сильно нагреваться. Крепеж лучше скрывать или применять решения, исключающие контакт кожи с металлом.</p>\n<h2 id=\"section-7\">Защитные покрытия</h2>\n<p>Для полков используют продукты, прямо предназначенные для бань и саун и допускающие контакт с такими поверхностями. Нельзя покрывать полки случайным интерьерным лаком только потому, что он «для дерева».</p>\n<h2 id=\"section-9\">Уход</h2>\n<p>После использования полки просушивают. Агрессивная бытовая химия и постоянное заливание водой сокращают срок службы поверхности.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>Официальные данные NEOMID 200; каталог BANGER.SU по осиновой отделке; паспорта специализированных масел.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Полки",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Стены и потолок",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Крепеж",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Защитные покрытия",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Уход",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Сравнение пород; фото полка крупным планом; схема скрытого крепежа.",
    "relatedSlugs": [
      "obrabotka-drevesiny-neomid-v-bane",
      "ventilyatsiya-mobilnoy-bani",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-16",
    "slug": "okna-i-dveri-v-bane",
    "title": "Окна и двери в бане: ПВХ, стекло, герметичность и теплопотери",
    "seoTitle": "Окна и двери в бане: ПВХ, стекло, герметичность и теплопотери",
    "metaDescription": "Как выбирать окна и двери для мобильной бани: ПВХ, панорамное остекление, стеклянная дверь в парную, монтаж и герметичность.",
    "excerpt": "Окно или дверь может стать самым заметным мостиком холода и источником влаги в откосе. Поэтому красивое остекление нужно оценивать вместе с монтажным узлом.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Входная дверь</h2>\n<p>ПВХ-дверь удобна стабильной геометрией и герметичным притвором, но качество профиля и монтажа имеет значение. Металлическая дверь дает другое ощущение прочности, но требует контроля теплового моста и конденсата.</p>\n<h2 id=\"section-3\">Дверь в парную</h2>\n<p>Стеклянные двери не боятся влаги, визуально облегчают помещение и удобны в уходе. Важны закаленное стекло, корректные зазоры и фурнитура, рассчитанная на банные условия.</p>\n<h2 id=\"section-5\">Окна</h2>\n<p>Чем больше площадь остекления, тем выше требования к стеклопакету и монтажу. Панорамное окно нужно учитывать и при подборе печи, потому что холодная стеклянная поверхность увеличивает тепловую нагрузку.</p>\n<h2 id=\"section-7\">Монтажный шов</h2>\n<p>Вода и пар не должны уходить в утеплитель вокруг рамы. Узел примыкания должен быть защищен и с внутренней, и с наружной стороны по проекту.</p>\n<h2 id=\"section-9\">Регулировка</h2>\n<p>После транспортировки и сезонных подвижек деревянной конструкции двери и окна иногда требуют регулировки. Это нормальная сервисная операция, если она предусмотрена конструкцией.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>Проектные требования конкретной модели; паспорта оконных и дверных систем.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Входная дверь",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Дверь в парную",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Окна",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Монтажный шов",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Регулировка",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Разрез монтажного шва; стеклянная дверь; тепловая схема окна.",
    "relatedSlugs": [
      "uteplenie-mobilnoy-bani-dlya-zimy",
      "kak-vybrat-pech-dlya-mobilnoy-bani",
      "kak-prinyat-mobilnuyu-banyu"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-17",
    "slug": "fasad-mobilnoy-bani",
    "title": "Фасад мобильной бани: планкен, дерево, графитовые элементы и защита от солнца и дождя",
    "seoTitle": "Фасад мобильной бани: планкен, дерево, графитовые элементы и защита от солнца и дождя",
    "metaDescription": "Как устроить долговечный фасад мобильной бани: деревянная облицовка, планкен, вентзазор, антисептик, масло и обновление покрытия.",
    "excerpt": "Фасад — это не только цвет. Наружная древесина получает ультрафиолет, дождь, снег и перепады температуры, поэтому долговечность зависит от системы: защита древесины, вентиляционный зазор, правильный крепеж и регулярное обновление финиша.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Вентиляционный зазор</h2>\n<p>Облицовка должна иметь возможность высыхать с обратной стороны. Если наружная доска прижата к мокрой мембране без воздуха, покрытие стареет быстрее.</p>\n<h2 id=\"section-3\">Антисептик и финиш</h2>\n<p>Биозащита не всегда является декоративным покрытием. Для наружных поверхностей важно понимать, нужен ли поверх антисептика финиш от воды и ультрафиолета. NEOMID 440, например, для наружного применения производитель рекомендует закрывать финишным ЛКМ.</p>\n<h2 id=\"section-5\">Цвет</h2>\n<p>Темные графитовые фасады сильнее нагреваются на солнце, а натуральные тона быстрее показывают посерение. У любого решения есть график обслуживания.</p>\n<h2 id=\"section-7\">Крепеж</h2>\n<p>Фасадный крепеж должен быть стойким к коррозии и не давать потеков. В скрытых системах важно соблюдать зазоры для сезонного изменения размеров доски.</p>\n<h2 id=\"section-9\">Обновление</h2>\n<p>Наружное покрытие не является вечным. Клиенту лучше сразу объяснить, как понять, что пришло время обновить масло или краску, чем обещать «не требует ухода».</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>Официальные рекомендации NEOMID 440/445; инструкции производителей фасадных покрытий.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Вентиляционный зазор",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Антисептик и финиш",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Цвет",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Крепеж",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Обновление",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Схема вентфасада; палитра; фото обновления масла; крепеж.",
    "relatedSlugs": [
      "obrabotka-drevesiny-neomid-v-bane",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": [
      {
        "href": "/kontakty#zayavka",
        "label": "Обсудить цвет фасада"
      }
    ]
  },
  {
    "id": "word-18",
    "slug": "dostavka-i-ustanovka-mobilnoy-bani",
    "title": "Как доставляют и устанавливают готовую мобильную баню: что происходит в день монтажа",
    "seoTitle": "Как доставляют и устанавливают готовую мобильную баню: что происходит в день монтажа",
    "metaDescription": "Как проходит доставка мобильной бани: подготовка маршрута, манипулятор или кран, установка на фундамент, выверка и подключение.",
    "excerpt": "Сильная сторона мобильной бани — большая часть работ выполняется на производстве. Но финальный результат зависит от того, насколько точно подготовлены маршрут, фундамент и монтаж на участке.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Маршрут</h2>\n<p>До выезда проверяют ограничения по высоте и ширине, состояние подъезда, повороты, мосты, провода и ветки. Клиент должен заранее отправить фото и размеры проблемных мест.</p>\n<h2 id=\"section-3\">Разгрузка</h2>\n<p>Способ зависит от массы, габаритов и доступности участка. Манипулятор удобен, когда может подъехать близко; при большом вылете или препятствиях нужен отдельный кран.</p>\n<h2 id=\"section-5\">Посадка на фундамент</h2>\n<p>Модуль опускают на проектные точки опирания, проверяют положение и уровень. Нельзя компенсировать ошибку в фундаменте случайными деревянными обрезками.</p>\n<h2 id=\"section-7\">Стыковка модулей</h2>\n<p>Для двухмодульных бань монтаж включает выверку геометрии, стыковку конструкций, утепление и герметизацию соединения, а также восстановление отделки.</p>\n<h2 id=\"section-9\">Подключение</h2>\n<p>После установки подключают коммуникации по согласованной схеме, проводят проверку электрики, воды, слива, печи и дымохода. Клиенту передают инструкции по первому запуску и уходу.</p>\n<h3 id=\"section-11\">Факт-чек / опорные источники</h3>\n<p>Технологическая карта производителя/монтажной бригады; требования перевозчика.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Маршрут",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Разгрузка",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Посадка на фундамент",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Стыковка модулей",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Подключение",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Фото перевозки; схема зоны крана; установка на сваи; стыковка двух модулей.",
    "relatedSlugs": [
      "podgotovka-ploshchadki-pod-mobilnuyu-banyu",
      "fundament-dlya-mobilnoy-bani-bloki-ili-svai",
      "kak-prinyat-mobilnuyu-banyu"
    ],
    "resourceLinks": []
  },
  {
    "id": "word-19",
    "slug": "kak-prinyat-mobilnuyu-banyu",
    "title": "Как принять готовую мобильную баню: чек-лист покупателя перед подписанием акта",
    "seoTitle": "Как принять готовую мобильную баню: чек-лист покупателя перед подписанием акта",
    "metaDescription": "Чек-лист приемки мобильной бани: геометрия, отделка, двери, окна, печь, дымоход, электрика, вода, слив и документы.",
    "excerpt": "Приемка — это не поиск микроскопической царапины, а системная проверка того, что баня соответствует договору и безопасно работает. Лучший производитель не боится прозрачного чек-листа.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 1,
    "content": "<h2 id=\"section-1\">Документы</h2>\n<p>Сверьте модель, планировку, комплектацию, перечень опций и серийное/проектное обозначение. Проверьте инструкции на печь, дымоход, электрическое и сантехническое оборудование.</p>\n<h2 id=\"section-3\">Геометрия и внешний вид</h2>\n<p>Осмотрите фасад, кровлю, стыки, углы, состояние при транспортировке. Внутри проверьте двери, окна, зазоры, полки и отсутствие незакрепленных элементов.</p>\n<h2 id=\"section-5\">Печь и дымоход</h2>\n<p>Проверьте крепление, защитные экраны, проходные узлы, положение дымохода и доступ для обслуживания. Первый розжиг лучше выполнять по инструкции производителя.</p>\n<h2 id=\"section-7\">Электрика</h2>\n<p>Щит должен быть подписан, свет и оборудование — включаться, кабельные вводы — быть закрыты. Проверку защитных устройств выполняет специалист.</p>\n<h2 id=\"section-9\">Вода и слив</h2>\n<p>Подайте воду, проверьте соединения и отсутствие течей, работу бойлера, душа и слива. Вода не должна стоять в мокрой зоне.</p>\n<h2 id=\"section-11\">Фиксация замечаний</h2>\n<p>Все замечания записывают в акт с фотографиями и понятным сроком устранения. Устная договоренность «потом приедем» хуже конкретной записи.</p>\n<h3 id=\"section-13\">Факт-чек / опорные источники</h3>\n<p>Договор и спецификация конкретного заказа; паспорта оборудования; проектная документация.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Документы",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Геометрия и внешний вид",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Печь и дымоход",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Электрика",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Вода и слив",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "Фиксация замечаний",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Печатный чек-лист на 30 пунктов; фото узлов, которые нужно осмотреть.",
    "relatedSlugs": [
      "dostavka-i-ustanovka-mobilnoy-bani",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": [
      {
        "href": "/usloviya-zakaza",
        "label": "Условия заказа"
      }
    ]
  },
  {
    "id": "word-20",
    "slug": "uhod-za-mobilnoy-baney",
    "title": "Как ухаживать за мобильной баней после покупки: сушка, древесина, печь, дымоход и сезонное обслуживание",
    "seoTitle": "Как ухаживать за мобильной баней после покупки: сушка, древесина, печь, дымоход и сезонное обслуживание",
    "metaDescription": "Практический регламент ухода за мобильной баней: что делать после каждого парения, раз в сезон и перед зимой.",
    "excerpt": "Большая часть проблем деревянной бани начинается не в день строительства, а после месяцев эксплуатации: помещение не сушат, вода остается в сливе, фасад годами не обновляют, а дымоход не чистят. Простой регламент обслуживания продлевает срок службы лучше многих дорогих опций.",
    "category": "Экспертные материалы",
    "date": "",
    "readTime": 2,
    "content": "<h2 id=\"section-1\">После каждого использования</h2>\n<p>Удалить воду с пола, открыть режим сушки, просушить полки и текстиль, проверить, что вентиляционные каналы не закрыты. Не оставлять баню герметично закрытой и мокрой.</p>\n<h2 id=\"section-3\">Раз в месяц или по интенсивности</h2>\n<p>Осматривать места вокруг печи и дымохода, крепления полков, герметичность душа и состояние сливов. Любые темные влажные пятна лучше исследовать сразу, а не ждать запаха плесени.</p>\n<h2 id=\"section-5\">Сезонно</h2>\n<p>Проверять наружное покрытие, кровлю, водостоки, фундамент и регулировку дверей/окон. Деревянная конструкция может немного изменять размеры в течение года, поэтому периодическая регулировка — нормальная часть обслуживания.</p>\n<h2 id=\"section-7\">Дымоход</h2>\n<p>Периодичность чистки зависит от режима топки, топлива и системы. Нельзя ждать полного ухудшения тяги. Осмотр и очистку выполняют по паспорту печи и дымохода.</p>\n<h2 id=\"section-9\">Перед морозами</h2>\n<p>Если баня используется периодически, воду из труб, бойлера и уязвимых сантехнических узлов сливают по инструкции. Проверяют, что наружные вводы защищены от замерзания.</p>\n<h2 id=\"section-11\">История обслуживания</h2>\n<p>Полезно вести простой журнал: дата обработки фасада, чистки дымохода, замены оборудования, регулировки дверей. Для производителя такой журнал может стать частью гарантийного сервиса и личного кабинета клиента.</p>\n<h3 id=\"section-13\">Факт-чек / опорные источники</h3>\n<p>Паспорта оборудования и покрытий; инструкции производителя бани.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "После каждого использования",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Раз в месяц или по интенсивности",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Сезонно",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "Дымоход",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "Перед морозами",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "История обслуживания",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "Факт-чек / опорные источники",
        "level": 3
      }
    ],
    "photoBrief": "Календарь обслуживания; чек-лист «после парения/раз в сезон/перед зимой».",
    "relatedSlugs": [
      "ventilyatsiya-mobilnoy-bani",
      "fasad-mobilnoy-bani",
      "voda-i-boyler-v-mobilnoy-bane",
      "dymohod-v-derevyannoy-bane"
    ],
    "resourceLinks": []
  }
]

export const projects: Project[] = [
  { id: '1', slug: 'istok-8-podmoskovye', title: 'Исток 8 в Подмосковье', model: 'Исток 8 (БГ-08)', region: 'Московская область', date: '2026-08', description: 'Полная комплектация с дополнительной верандой.', image: '/NEW-SITE-BANI/images/renders/istok-8.webp', images: ['/NEW-SITE-BANI/images/renders/istok-8.webp'], tags: ['На участке', 'Полная комплектация'] },
  { id: '2', slug: 'sever-panorama-8-mos', title: 'Север Панорама 8', model: 'Север Панорама 8 (БГ-21)', region: 'Московская область', date: '2026-07', description: 'Доставка и установка в Московской области. Обливное устройство.', image: '/NEW-SITE-BANI/images/renders/sever-panorama-8.webp', images: ['/NEW-SITE-BANI/images/renders/sever-panorama-8.webp'], tags: ['На участке', 'Обливное устройство'] },
  { id: '3', slug: 'usadba-terra-podmoskovye', title: 'Усадьба Терра 7 в Раменском', model: 'Усадьба Терра 7 (БГ-31)', region: 'Московская область', date: '2026-06', description: 'Широкоформатная баня с крытой террасой.', image: '/NEW-SITE-BANI/images/renders/usadba-terra-7.webp', images: ['/NEW-SITE-BANI/images/renders/usadba-terra-7.webp'], tags: ['Терраса', 'Брус'] },
  { id: '4', slug: 'skandinaviya-komfort-plus-7-spb', title: 'Скандинавия Комфорт+ 7', model: 'Скандинавия Комфорт+ 7 (БГ-17)', region: 'Ленинградская обл.', date: '2026-05', description: 'Баня с санузлом, бойлером и тропическим душем.', image: '/NEW-SITE-BANI/images/renders/skandinaviya-komfort-plus-7.webp', images: ['/NEW-SITE-BANI/images/renders/skandinaviya-komfort-plus-7.webp'], tags: ['Санузел', 'Тропический душ'] },
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)
}
export function getSaunasByPopularity(): Sauna[] { return saunas.filter(s => s.isPopular) }
export function getHomesByPopularity(): Home[] { return homes.filter(h => h.isPopular) }
export function getSaunaCount(): number { return saunas.length }
export function getHomeCount(): number { return homes.length }
