import type { Sauna, Home, Article, SiteSettings } from '@/types'

export const siteSettings: SiteSettings = {
  phone: '+79362000050',
  phoneDisplay: '8 (936) 200-00-50',
  phone2: '+79363000050',
  phoneDisplay2: '8 (936) 300-00-50',
  email: 'banger.ram@bk.ru',
  address: 'Раменское, ул. Михалевича, 143Е',
  addressShowroom: 'Раменское, ул. Михалевича, 118к1',
  telegram: 'https://t.me/banigerasimov',
  max: 'https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs',
  vk: '#', youtube: '#',
  workingHours: 'Пн–Вс: 9:00–19:00',
}

export const saunas: Sauna[] = [
  { isPublished: false, id: 'bg-01', slug: 'istok-4', name: "Исток 4", article: "БГ-01", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Компактный формат с парной и комнатой отдыха.", description: "Компактный формат с парной и комнатой отдыха.", image: "/images/catalog/bg-01/model.png", images: ["/images/catalog/bg-01/model.png"], floorPlan: '/images/plans/bg-01.png', size: "4 × 2,4 м", area: 9.6, priceFrom: 412500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4 × 2,4 м"}, {"label": "Площадь застройки", "value": "9,6 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false, interiorImages: ['/images/interiors/parnaya-2-.jpg','/images/interiors/pomiv-.jpg',] },
  { isPublished: false, id: 'bg-02', slug: 'istok-terra-5', name: "Исток Терра 5", article: "БГ-02", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Двухзонная баня с отдельным входным крыльцом. По исходному плану: модуль 5 м и крыльцо 1 м.", description: "Двухзонная баня с отдельным входным крыльцом. По исходному плану: модуль 5 м и крыльцо 1 м.", image: "/images/catalog/bg-02/model.png", images: ["/images/catalog/bg-02/model.png"], floorPlan: '/images/plans/bg-02.png', size: "5 × 2,4 м + крыльцо", area: 12.0, priceFrom: 471000, tags: [], specs: [{"label": "Размер", "value": "5 × 2,4 м + крыльцо"}, {"label": "Площадь застройки", "value": "12,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { isPublished: false, id: 'bg-03', slug: 'istok-5', name: "Исток 5", article: "БГ-03", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Дополнительное пространство в простом прямоугольном модуле.", description: "Дополнительное пространство в простом прямоугольном модуле.", image: "/images/catalog/bg-03/model.png", images: ["/images/catalog/bg-03/model.png"], floorPlan: '/images/plans/bg-03.png', size: "5 × 2,4 м", area: 12.0, priceFrom: 464500, tags: [], specs: [{"label": "Размер", "value": "5 × 2,4 м"}, {"label": "Площадь застройки", "value": "12,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: false, id: 'bg-04', slug: 'istok-6', name: "Исток 6", article: "БГ-04", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Увеличенный модуль с парной и зоной отдыха.", description: "Увеличенный модуль с парной и зоной отдыха.", image: "/images/catalog/bg-04/model.png", images: ["/images/catalog/bg-04/model.png"], floorPlan: '/images/plans/bg-04.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 484000, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: false, id: 'bg-05', slug: 'istok-semeynyy-7', name: "Исток Семейный 7", article: "БГ-05", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Раздельные зоны и вход со стороны длинного фасада.", description: "Раздельные зоны и вход со стороны длинного фасада.", image: "/images/catalog/bg-05/model.png", images: ["/images/catalog/bg-05/model.png"], floorPlan: '/images/plans/bg-05.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 516500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: true, hasTerrace: false, hasShower: false },
  { isPublished: false, id: 'bg-06', slug: 'istok-semeynyy-7r', name: "Исток Семейный 7R", article: "БГ-06", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Альтернативное расположение помещений: парная справа на плане.", description: "Альтернативное расположение помещений: парная справа на плане.", image: "/images/catalog/bg-06/model.png", images: ["/images/catalog/bg-06/model.png"], floorPlan: '/images/plans/bg-06.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 516500, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { isPublished: false, id: 'bg-07', slug: 'istok-prostor-7', name: "Исток Простор 7", article: "БГ-07", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Другая пропорция помещений в семиметровом модуле.", description: "Другая пропорция помещений в семиметровом модуле.", image: "/images/catalog/bg-07/model.png", images: ["/images/catalog/bg-07/model.png"], floorPlan: '/images/plans/bg-07.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 510000, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: false, id: 'bg-08', slug: 'istok-8', name: "Исток 8", article: "БГ-08", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Самый длинный модуль серии с отдельными зонами отдыха и парения.", description: "Самый длинный модуль серии с отдельными зонами отдыха и парения.", image: "/images/catalog/bg-08/model.png", images: ["/images/catalog/bg-08/model.png"], floorPlan: '/images/plans/bg-08.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 601000, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм или брус 90 × 140 мм", "Осиновая отделка парной и полки", "Печь «Каменка-2», бак и камни", "Освещение, стол и две лавки", "Пол и потолок: утепление 50 мм по базовой спецификации"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: true, id: 'bg-09', slug: 'skandinaviya-mini-45', name: "Скандинавия 4,5 В", article: "БГ-09", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Компактная баня с входной площадкой.", description: "Компактная баня с входной площадкой.", image: "/images/catalog/bg-09/model.png", images: ["/images/catalog/bg-09/model.png"], floorPlan: '/images/plans/bg-09.png', size: "4,5 × 2,4 м", area: 10.8, priceFrom: 575000, tags: [], specs: [{"label": "Размер", "value": "4,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "10,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { isPublished: true, id: 'bg-10', slug: 'skandinaviya-start-6', name: "Скандинавия 6 В", article: "БГ-10", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Крытое крыльцо, комната отдыха и парная. Две основные внутренние зоны в шестиметровом формате.", description: "Крытое крыльцо, комната отдыха и парная. Две основные внутренние зоны в шестиметровом формате.", image: "/images/catalog/bg-10/model.png", images: ["/images/catalog/bg-10/model.png"], floorPlan: '/images/plans/bg-10.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 607500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: false },
  { isPublished: true, id: 'bg-11', slug: 'skandinaviya-start-65', name: "Скандинавия 6,5 Д-В", article: "БГ-11", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Три помещения и небольшой запас пространства у входа.", description: "Три помещения и небольшой запас пространства у входа.", image: "/images/catalog/bg-11/model.png", images: ["/images/catalog/bg-11/model.png"], floorPlan: '/images/plans/bg-11.png', size: "6,5 × 2,4 м", area: 15.6, priceFrom: 640000, tags: [], specs: [{"label": "Размер", "value": "6,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "15,6 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: true },
  { isPublished: true, id: 'bg-12', slug: 'skandinaviya-standart-7', name: "Скандинавия 7 Д", article: "БГ-12", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Комната отдыха, моечная и парная в одном модуле.", description: "Комната отдыха, моечная и парная в одном модуле.", image: "/images/catalog/bg-12/model.png", images: ["/images/catalog/bg-12/model.png"], floorPlan: '/images/plans/bg-12.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 646500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: true },
  { isPublished: true, id: 'bg-13', slug: 'skandinaviya-standart-75', name: "Скандинавия 7,5 Д-В", article: "БГ-13", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Удлинённая версия с разделением основных зон.", description: "Удлинённая версия с разделением основных зон.", image: "/images/catalog/bg-13/model.png", images: ["/images/catalog/bg-13/model.png"], floorPlan: '/images/plans/bg-13.png', size: "7,5 × 2,4 м", area: 18.0, priceFrom: 672500, tags: [], specs: [{"label": "Размер", "value": "7,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "18,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: true },
  { isPublished: true, id: 'bg-14', slug: 'skandinaviya-komfort-6', name: "Скандинавия 6 Д", article: "БГ-14", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Боковой вход и отдельная моечная зона.", description: "Боковой вход и отдельная моечная зона.", image: "/images/catalog/bg-14/model.png", images: ["/images/catalog/bg-14/model.png"], floorPlan: '/images/plans/bg-14.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 646500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: true },
  { isPublished: true, id: 'bg-15', slug: 'skandinaviya-komfort-8', name: "Скандинавия 8 Д-В", article: "БГ-15", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Просторный формат с входной площадкой.", description: "Просторный формат с входной площадкой.", image: "/images/catalog/bg-15/model.png", images: ["/images/catalog/bg-15/model.png"], floorPlan: '/images/plans/bg-15.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 731000, tags: [], specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: false, hasTerrace: true, hasShower: true },
  { isPublished: true, id: 'bg-16', slug: 'skandinaviya-komfort-plus-6', name: "Скандинавия 6 С-Д", article: "БГ-16", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Комната отдыха, моечная, парная и санузел по плану.", description: "Комната отдыха, моечная, парная и санузел по плану.", image: "/images/catalog/bg-16/model.png", images: ["/images/catalog/bg-16/model.png"], floorPlan: '/images/plans/bg-16.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 640000, tags: [], specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { isPublished: true, id: 'bg-17', slug: 'skandinaviya-komfort-plus-7', name: "Скандинавия 7 С-Д", article: "БГ-17", series: 'Скандинавия', collection: 'Скандинавская коллекция', subtitle: "Расширенная планировка с санузлом и отдельной моечной.", description: "Расширенная планировка с санузлом и отдельной моечной.", image: "/images/catalog/bg-17/model.png", images: ["/images/catalog/bg-17/model.png"], floorPlan: '/images/plans/bg-17.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 698500, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная и зона отдыха", "Каркас 100 мм", "ПВХ-окна и входная ПВХ-дверь", "Стеклянные двери мокрых зон по проекту", "Печь Ермак 12, бак 55 л, камни", "Пол и потолок: утепление 100 мм"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { isPublished: true, id: 'bg-18', slug: 'sever-layt-4', name: "Скандинавия 4", article: "БГ-18", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/images/catalog/bg-18/model.png", images: ["/images/catalog/bg-18/model.png"], floorPlan: '/images/plans/bg-18.png', size: "4 × 2,4 м", area: 9.6, priceFrom: 619200, tags: [], specs: [{"label": "Размер", "value": "4 × 2,4 м"}, {"label": "Площадь застройки", "value": "9,6 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и уличная подсветка", "Абажуры и ограждение печи"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: true, id: 'bg-19', slug: 'sever-terra-65', name: "Скандинавия 6,5 Д-В", article: "БГ-19", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/images/catalog/bg-19/model.png", images: ["/images/catalog/bg-19/model.png"], floorPlan: '/images/plans/bg-19.png', size: "6,5 × 2,4 м", area: 15.6, priceFrom: 753100, tags: [], specs: [{"label": "Размер", "value": "6,5 × 2,4 м"}, {"label": "Площадь застройки", "value": "15,6 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и уличная подсветка", "Ламинация окон и двери", "Тропический душ и бойлер 50 л", "Профлист в цвете графит"], hasBathroom: false, hasTerrace: true, hasShower: true },
  { isPublished: true, id: 'bg-20', slug: 'sever-rezidents-7', name: "Скандинавия 7 С-Д", article: "БГ-20", series: 'Север', collection: 'Северная коллекция', subtitle: "Санузел, душевая и индивидуальные дополнения, перечисленные на странице модели.", description: "Мобильная баня с санузлом и отдельной душевой. Особенности этого исполнения перечислены отдельно и уже учтены в указанной цене.", image: "/images/catalog/bg-20/model.png", images: ["/images/catalog/bg-20/model.png"], floorPlan: '/images/plans/bg-20.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 1039100, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и подсветка", "Ламинация окон и двери", "Тропический душ и бойлер 50 л", "Санузел и декоративные рейки"], executionFeatures: ["Санузел", "Проливные полы в парной и помывочной", "Панорамное окно", "Декоративные наружные рейки под окнами и над дверью", "Дополнительные наружные светильники", "Индивидуальная планировка", "Увеличение высоты на 20 см", "Покраска по RAL", "Полы из лиственницы в парной и помывочной"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { isPublished: true, id: 'bg-21', slug: 'sever-panorama-8', name: "Скандинавия 8 С-Д", article: "БГ-21", series: 'Север', collection: 'Северная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/images/catalog/bg-21/model.png", images: ["/images/catalog/bg-21/model.png"], floorPlan: '/images/plans/bg-21.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 876600, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Скрытая электрика и подсветка", "Бойлер 50 л и обливное устройство", "Проливной пол в парной и мойке", "Декоративные рейки"], hasBathroom: true, hasTerrace: false, hasShower: true },
  { isPublished: false, id: 'bg-22', slug: 'istok-grafit-4', name: "Исток Графит 4", article: "БГ-22", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/images/catalog/bg-22/model.png", images: ["/images/catalog/bg-22/model.png"], floorPlan: '/images/plans/bg-22.png', size: "4 × 2,4 м", area: 9.6, priceFrom: 447600, tags: [], specs: [{"label": "Размер", "value": "4 × 2,4 м"}, {"label": "Площадь застройки", "value": "9,6 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Вывод трубы в крышу", "Ограждение печи", "Декоративные рейки", "Утепление: каменная вата 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: false, id: 'bg-23', slug: 'istok-teplo-6', name: "Исток Тепло 6", article: "БГ-23", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/images/catalog/bg-23/model.png", images: ["/images/catalog/bg-23/model.png"], floorPlan: '/images/plans/bg-23.png', size: "6 × 2,4 м", area: 14.4, priceFrom: 534700, tags: [], specs: [{"label": "Размер", "value": "6 × 2,4 м"}, {"label": "Площадь застройки", "value": "14,4 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Вывод трубы в крышу", "Стеклянная дверь в парной", "Проливной пол в мойке", "Утепление: каменная вата 100 мм"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: false, id: 'bg-24', slug: 'istok-stil-7', name: "Исток Стиль 7", article: "БГ-24", series: 'Исток', collection: 'Модульная коллекция', subtitle: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", description: "Вариант индивидуального исполнения. Внешний вид показан в визуализации.", image: "/images/catalog/bg-24/model.png", images: ["/images/catalog/bg-24/model.png"], floorPlan: '/images/plans/bg-24.png', size: "7 × 2,4 м", area: 16.8, priceFrom: 611400, tags: [], specs: [{"label": "Размер", "value": "7 × 2,4 м"}, {"label": "Площадь застройки", "value": "16,8 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Печь Ермак 12", "Стеклянная дверь в парной", "Металлическая входная дверь", "Декоративные рейки, цвет графит", "Вывод крана в мойку"], hasBathroom: false, hasTerrace: false, hasShower: false },
  { isPublished: true, id: 'bg-28', slug: 'barn-premium', name: "Барн Премиум 8 Д-В", article: "БГ-28", series: 'Барн', collection: 'Премиум', subtitle: "Гостиная, душевая, парная и крытое крыльцо. Флагманское исполнение для загородного отдыха.", description: "Гостиная, душевая, парная и крытое крыльцо. Флагманское исполнение для загородного отдыха.", image: "/images/catalog/bg-28/model.png", images: ["/images/catalog/bg-28/model.png", "/images/catalog/bg-28/owner-render.png"], floorPlan: '/images/plans/bg-28.png', size: "8 × 2,4 м", area: 19.2, priceFrom: 1435000, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "8 × 2,4 м"}, {"label": "Площадь застройки", "value": "19,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Чугунная печь ЭТНА 18 и бак 30 л", "Душевая кабина и бойлер 50 л", "Скрытая электрика и сантехника", "Утепление 100 мм", "Масло на полках и полах парной"], interiorImages: ["/images/gallery/barn-premium/image1.jpeg", "/images/gallery/barn-premium/image2.jpeg", "/images/gallery/barn-premium/image3.jpeg", "/images/gallery/barn-premium/image4.jpeg", "/images/gallery/barn-premium/image5.jpeg", "/images/gallery/barn-premium/image6.jpeg", "/images/gallery/barn-premium/image7.jpeg", "/images/gallery/barn-premium/image8.jpeg", "/images/gallery/barn-premium/image9.jpeg", "/images/gallery/barn-premium/image10.jpeg", "/images/gallery/barn-premium/image11.jpeg", "/images/gallery/barn-premium/image12.jpeg", "/images/gallery/barn-premium/image13.jpeg", "/images/gallery/barn-premium/image14.jpeg", "/images/gallery/barn-premium/image15.jpeg"], hasBathroom: false, hasTerrace: true, hasShower: true },
]

export const homes: Home[] = [
  { isPublished: false, id: 'bg-25', slug: 'usadba-praktik', name: "Усадьба Практик", article: "БГ-25", subtitle: "Баня с дополнительным хозяйственным модулем.", description: "Баня с дополнительным хозяйственным модулем.", image: "/images/catalog/bg-25/model.png", images: ["/images/catalog/bg-25/model.png"], size: "7 × 4,6 м", area: 32.2, priceFrom: 1515500, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 4,6 м"}, {"label": "Площадь застройки", "value": "32,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Двухмодульный формат", "Планировка и комплектация согласуются при заказе"] },
  { isPublished: false, id: 'bg-26', slug: 'usadba-prostor', name: "Усадьба Простор", article: "БГ-26", subtitle: "Баня в широком двухмодульном формате.", description: "Баня в широком двухмодульном формате.", image: "/images/catalog/bg-26/model.png", images: ["/images/catalog/bg-26/model.png"], size: "7 × 4,6 м", area: 32.2, priceFrom: 1368600, tags: [], isPopular: true, specs: [{"label": "Размер", "value": "7 × 4,6 м"}, {"label": "Площадь застройки", "value": "32,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Двухмодульный формат", "Планировка и комплектация согласуются при заказе"] },
  { isPublished: false, id: 'bg-27', slug: 'usadba-veranda', name: "Усадьба Веранда", article: "БГ-27", subtitle: "Баня с верандой для отдыха на открытом воздухе.", description: "Баня с верандой для отдыха на открытом воздухе.", image: "/images/catalog/bg-27/model.png", images: ["/images/catalog/bg-27/model.png"], size: "7 × 4,6 м", area: 32.2, priceFrom: 1697500, tags: [], isPopular: false, specs: [{"label": "Размер", "value": "7 × 4,6 м"}, {"label": "Площадь застройки", "value": "32,2 м²"}, {"label": "Исполнение", "value": "Представленное исполнение"}], features: ["Двухмодульный формат", "Планировка и комплектация согласуются при заказе"] },
  { isPublished: false, id: 'bg-29', slug: 'usadba-uyt-5', name: "Усадьба Уют 5", article: "БГ-29", subtitle: "Компактная баня широкого формата. Площадь застройки 22,5 м²", description: "Компактная баня широкого формата. Площадь застройки 22,5 м²", image: "/images/catalog/bg-29/model.png", images: ["/images/catalog/bg-29/model.png"], floorPlan: '/images/plans/bg-29.jpg', size: "4,5 × 5 м", area: 22.5, priceFrom: 1236000, priceVariants: ["Каркас 150 мм: 1 275 000 ₽", "Брус: 1 275 000 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4,5 × 5 м"}, {"label": "Площадь застройки", "value": "22,5 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная, моечная и санузел", "Комната отдыха"] },
  { isPublished: false, id: 'bg-30', slug: 'usadba-semejnaya-6', name: "Усадьба Семейная 6", article: "БГ-30", subtitle: "Больше места для отдыха после парной. Площадь застройки 27 м²", description: "Больше места для отдыха после парной. Площадь застройки 27 м²", image: "/images/catalog/bg-30/model.png", images: ["/images/catalog/bg-30/model.png"], floorPlan: '/images/plans/bg-30.jpg', size: "4,5 × 6 м", area: 27.0, priceFrom: 1385500, priceVariants: ["Брус: 1 424 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4,5 × 6 м"}, {"label": "Площадь застройки", "value": "27,0 м²"}, {"label": "Исполнение", "value": "Каркас 100 мм"}], features: ["Парная, моечная и санузел", "Комната отдыха"] },
  { isPublished: false, id: 'bg-31', slug: 'usadba-terra-7', name: "Усадьба Терра 7", article: "БГ-31", subtitle: "Крытая терраса для отдыха на воздухе. Площадь застройки 31,5 м² с террасой", description: "Крытая терраса для отдыха на воздухе. Площадь застройки 31,5 м² с террасой", image: "/images/catalog/bg-31/model.png", images: ["/images/catalog/bg-31/model.png"], floorPlan: '/images/plans/bg-31.jpg', size: "4,5 × 7 м", area: 31.5, priceFrom: 1476500, priceVariants: ["Каркас 150 мм: 1 489 500 ₽"], tags: [], isPopular: true, specs: [{"label": "Размер", "value": "4,5 × 7 м"}, {"label": "Площадь застройки", "value": "31,5 м²"}, {"label": "Исполнение", "value": "Исполнение из бруса"}], features: ["Парная, моечная и санузел", "Комната отдыха"] },
]

export const articles: Article[] = [
  {
    "id": "research-sauna-body",
    "slug": "chto-proishodit-s-organizmom-v-bane",
    "coverImage": "/images/articles/2026-11-26/chto-proishodit-s-organizmom-v-bane.webp",
    "coverAlt": "Тёплая парная и удобные полки — основа комфортного отдыха.",
    "title": "Что происходит с организмом, когда вы ходите в баню",
    "seoTitle": "Что происходит с организмом, когда вы ходите в баню | BANGER.SU",
    "metaDescription": "Тепло и самочувствие: как организм реагирует на баню и почему важно не перегреваться.",
    "excerpt": "Тепло и самочувствие: как организм реагирует на баню и почему важно не перегреваться.",
    "category": "Здоровье и отдых",
    "date": "2026-10-05",
    "readTime": 2,
    "image": "/images/articles/2026-11-26/chto-proishodit-s-organizmom-v-bane.webp",
    "imageAlt": "Тёплая парная и удобные полки — основа комфортного отдыха.",
    "imageCaption": "3D-визуализация. Тёплая парная и удобные полки — основа комфортного отдыха.",
    "content": "<p>Баня помогает отвлечься от повседневных дел и расслабиться. Но приятное тепло — это ещё и нагрузка на организм. Чтобы отдых приносил удовольствие, важно понимать, что происходит во время парения и почему не стоит гнаться за высокой температурой.</p>\n<h2 id=\"section-1\">Как организм реагирует на тепло</h2>\n<p>Кожа нагревается, поверхностные сосуды расширяются, усиливается потоотделение. Организм таким образом отдаёт часть тепла окружающей среде. Сердце может сокращаться чаще, а артериальное давление — изменяться. В очень влажной парной пот испаряется хуже, поэтому одинаковая температура воздуха переносится по-разному в сухой сауне и при активной подаче воды на камни.</p>\n<p>После выхода из парной организму требуется время для охлаждения. Некоторым людям тепло помогает снять ощущение мышечного напряжения, расслабиться и легче переключиться на отдых.</p>\n<h2 id=\"section-3\">Что известно о пользе</h2>\n<p>В проспективном исследовании финской сауны участвовали 2315 мужчин 42–60 лет из Восточной Финляндии. Более высокая частота посещений была связана с меньшим риском смертельных сердечно-сосудистых исходов. Это наблюдательный результат: он показывает ассоциацию, но не доказывает, что сауна предотвращает или лечит заболевания. Результаты исследований сухой сауны нельзя автоматически переносить на любой режим русской бани. Парение не заменяет лекарства, физическую активность или медицинскую помощь. Пот содержит прежде всего воду и соли; обещания «вывести все токсины» не имеют надёжного основания. Источник: <a href=\"https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2130724/\" target=\"_blank\" rel=\"noopener noreferrer\">Laukkanen et al., JAMA Internal Medicine, 2015</a>.</p>\n<h2 id=\"section-5\">Как париться комфортно</h2>\n<p>Начинайте с умеренного жара, делайте перерывы, пейте воду и ориентируйтесь на самочувствие. Не употребляйте алкоголь перед парением и во время него. Не оставайтесь в парной при головокружении, тошноте, боли в груди или выраженной слабости. При потере сознания, боли в груди или спутанности сознания необходима срочная медицинская помощь. При хронических заболеваниях, беременности или недавнем недомогании режим посещения лучше предварительно обсудить с врачом.</p>\n<p>Настоящий банный комфорт складывается из удобных полков, возможности регулировать тепло, свежего воздуха и места для спокойного отдыха между заходами.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Как организм реагирует на тепло",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Что известно о пользе",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Как париться комфортно",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "ventilyatsiya-mobilnoy-bani",
      "kak-vybrat-pech-dlya-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "imageWidth": 1600,
    "imageHeight": 900,
    "updatedAt": "2026-11-26",
    "presentation": "immersive"
  },
  {
    "id": "word-01",
    "slug": "kak-vybrat-drevesinu-dlya-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/kak-vybrat-drevesinu-dlya-mobilnoy-bani.webp",
    "coverAlt": "Деревянные стойки образуют каркас; качество доски важно для геометрии конструкции.",
    "title": "Как выбрать древесину для мобильной бани: сухая строганая доска",
    "seoTitle": "Как выбрать древесину для мобильной бани: сухая строганая доска | BANGER.SU",
    "metaDescription": "Влажность, геометрия, сорт и сечение доски: что действительно определяет качество каркаса.",
    "excerpt": "Влажность, геометрия, сорт и сечение доски: что действительно определяет качество каркаса.",
    "category": "Материалы",
    "date": "",
    "readTime": 2,
    "content": "<p>Отделка видна сразу, а несущий каркас покупатель после сборки обычно не видит. Именно поэтому качество пиломатериала стоит обсуждать до заказа. Даже дорогая вагонка не исправит перекосы основания или стойки, которую повело при высыхании.</p>\n<h2 id=\"section-1\">Почему важна сухая древесина</h2>\n<p>В процессе сушки дерево изменяет размеры. Если сырую доску сразу закрыть утеплителем и облицовкой, при дальнейшей усушке могут появиться щели, деформироваться стойки и измениться геометрия проёмов. Сухая древесина при правильном хранении более предсказуема. Влажность проверяют влагомером на нескольких элементах, учитывая породу и температуру материала. Одна цифра на случайной доске не характеризует всю партию.</p>\n<p>Строгание выравнивает поверхности и облегчает плотную сборку. Но строганая доска не обязательно сухая: это два отдельных признака.</p>\n<h2 id=\"section-3\">Сорт и сечение — разные параметры</h2>\n<p>Для несущих элементов важны прочность и допустимые дефекты: крупные сучки, трещины, поражение грибком, кривизна. Декоративный класс вагонки не является классом прочности конструкционной доски. Сечение стоек, лаг и балок выбирают по нагрузке, пролёту и схеме опирания. У BANGER стандартная толщина каркаса стен — 100 мм; это не означает одинаковое сечение всех деревянных деталей бани.</p>\n<h2 id=\"section-5\">Что проверить перед заказом</h2>\n<p>Уточните, какая древесина предусмотрена для основания, стен и перекрытий; как её хранят; чем защищают скрытые поверхности и как контролируют геометрию. Осмотрите открытый каркас до отделки, если есть возможность посетить производство. Прямые стойки, ровные проёмы, аккуратные соединения и плотное прилегание утеплителя важнее красивого рекламного названия сорта.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Почему важна сухая древесина",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Сорт и сечение — разные параметры",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Что проверить перед заказом",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "materialy-dlya-mobilnoy-bani",
      "pochemu-karkasnaya-banya"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/kak-vybrat-drevesinu-dlya-mobilnoy-bani.webp",
    "imageAlt": "Деревянные стойки образуют каркас; качество доски важно для геометрии конструкции.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Деревянные стойки образуют каркас; качество доски важно для геометрии конструкции.",
    "updatedAt": "2026-11-26",
    "presentation": "checklist"
  },
  {
    "id": "word-02",
    "slug": "obrabotka-drevesiny-neomid-v-bane",
    "coverImage": "/images/articles/2026-11-26/obrabotka-drevesiny-neomid-v-bane.webp",
    "coverAlt": "Деревянный фасад требует покрытия, рассчитанного на наружную эксплуатацию.",
    "image": "/images/articles/2026-11-26/obrabotka-drevesiny-neomid-v-bane.webp",
    "imageAlt": "Деревянный фасад требует покрытия, рассчитанного на наружную эксплуатацию.",
    "imageCaption": "3D-визуализация. Деревянный фасад требует покрытия, рассчитанного на наружную эксплуатацию.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "title": "Чем обрабатывать древесину в бане: выбираем состав NEOMID",
    "seoTitle": "Чем обрабатывать древесину в бане: выбираем состав NEOMID | BANGER.SU",
    "metaDescription": "Как различаются средства для парной, скрытых деталей, фасада и огнезащиты.",
    "excerpt": "Как различаются средства для парной, скрытых деталей, фасада и огнезащиты.",
    "category": "Материалы",
    "date": "",
    "readTime": 2,
    "content": "<p>Дерево в парной, на фасаде и в скрытом перекрытии работает в разных условиях. На полок человек садится кожей, наружные доски мокнут под дождём, а лаги находятся в зоне возможного увлажнения. Поэтому один и тот же защитный состав нельзя автоматически наносить на всю баню.</p>\n<h2 id=\"section-1\">Внутренние помещения и парная</h2>\n<p>NEOMID 200 разработан для древесины в банях и саунах. Его применяют по инструкции производителя, в том числе на допускаемых поверхностях полков и скамеек. NEOMID 400 предназначен для внутренних работ; его название само по себе не подтверждает пригодность для горячей парной. Для поверхностей, с которыми соприкасается кожа, выбирают только составы, прямо разрешённые для такого применения. Не заменяйте специальную обработку обычным фасадным лаком.</p>\n<h2 id=\"section-3\">Скрытые элементы и наружная древесина</h2>\n<p>NEOMID 440 ECO применяется для биозащиты древесины снаружи и внутри в предусмотренных инструкцией условиях. NEOMID 430 ECO и усиленный NEOMID 433 относятся к трудновымываемой защите; они могут быть уместны на скрытых элементах, подверженных увлажнению, если это разрешено проектом и паспортом средства. NEOMID 445 совмещает защиту и декоративное окрашивание; пригодность для конкретной фасадной системы и совместимость с финишным покрытием уточняют отдельно.</p>\n<h2 id=\"section-5\">Что даёт огнебиозащита</h2>\n<p>NEOMID 450-1 предназначен для огне- и биозащитной обработки древесины. Эффективность зависит от подготовки поверхности, расхода, способа нанесения и условий эксплуатации. Его применяют в условиях, исключающих вымывание, и не используют на полках или в горячей зоне без прямого допуска производителя. Огнезащита не делает дерево негорючим и не заменяет безопасную установку печи и дымохода. Перед применением любого состава необходимо соблюдать технический лист конкретной версии, время высыхания и фиксации, ограничения по температуре и влажности. Смешивать средства или сокращать время выдержки без подтверждения совместимости не стоит.</p>\n<p>Главная защита дерева — исключить длительное намокание и обеспечить просушку. Пропитка дополняет конструктивные решения, а не исправляет их ошибки.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Внутренние помещения и парная",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Скрытые элементы и наружная древесина",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Что даёт огнебиозащита",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "uhod-za-mobilnoy-baney",
      "fasad-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "reference"
  },
  {
    "id": "word-03",
    "slug": "materialy-dlya-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/materialy-dlya-mobilnoy-bani.webp",
    "coverAlt": "Пример сочетания деревянного каркаса, утеплителя, мембран и облицовки.",
    "title": "Из чего состоит мобильная каркасная баня",
    "seoTitle": "Из чего состоит мобильная каркасная баня | BANGER.SU",
    "metaDescription": "Каркас, минеральная вата, мембраны, крепёж, кровля и отделка — как материалы работают вместе.",
    "excerpt": "Каркас, минеральная вата, мембраны, крепёж, кровля и отделка — как материалы работают вместе.",
    "category": "Материалы",
    "date": "",
    "readTime": 2,
    "content": "<p>Качественная баня — это не просто деревянная обшивка, печь и красивые окна. Её комфорт и долговечность зависят от того, как устроены скрытые элементы: основание, несущие стены, теплоизоляция, защита от влаги и соединения.</p>\n<h2 id=\"section-1\">Несущая конструкция и утепление</h2>\n<p>BANGER производит мобильные бани в каркасном исполнении. В стандартной комплектации используется сухой деревянный каркас стен толщиной 100 мм. Основание и обвязка передают нагрузку на фундамент. Стены, пол и потолок утепляются минеральной ватой ISOVER или URSA толщиной 100 мм. Состав материалов индивидуального проекта сверяют с утверждённой спецификацией.</p>\n<h2 id=\"section-3\">Защита от воды, ветра и пара</h2>\n<p>Со стороны помещения предусмотрена пароизоляция, а с наружной стороны утеплителя — ветровлагозащита. В парной применяется фольгированная бумага, все её стыки проклеиваются алюминиевым скотчем. Наружная мембрана защищает волокнистый материал от продувания и случайной влаги; она не заменяет водонепроницаемую кровлю или гидроизоляцию мокрых зон. Соединения и примыкания выполняют в соответствии с системой материалов.</p>\n<h2 id=\"section-5\">Видимые элементы</h2>\n<p>В базовом варианте наружная отделка — имитация бруса, кровля — односкатная с профилированным листом. Внутри применяется хвойная вагонка, в парной — осина класса А, полки из осины. Печь «Ермак» с дымоходом, открытая электрика и белые окна и двери по планировке входят в стандартную комплектацию. Крепёж подбирают по нагрузке, условиям влажности и совместимости материалов.</p>\n<p>Выбирая баню, сравнивайте не только цену квадратного метра. Уточняйте весь набор слоёв, окон, печного оборудования и опций: именно состав конкретного предложения определяет итоговую стоимость.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Несущая конструкция и утепление",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Защита от воды, ветра и пара",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Видимые элементы",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "pirog-steny-mobilnoy-bani",
      "uteplenie-isover-ursa-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/materialy-dlya-mobilnoy-bani.webp",
    "imageAlt": "Пример сочетания деревянного каркаса, утеплителя, мембран и облицовки.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Пример сочетания деревянного каркаса, утеплителя, мембран и облицовки.",
    "updatedAt": "2026-11-26",
    "presentation": "anatomy"
  },
  {
    "id": "word-04",
    "slug": "podgotovka-ploshchadki-pod-mobilnuyu-banyu",
    "coverImage": "/images/articles/2026-11-26/podgotovka-ploshchadki-pod-mobilnuyu-banyu.webp",
    "coverAlt": "Готовый модуль устанавливают на заранее подготовленное место с доступом для техники.",
    "title": "Как подготовить участок под мобильную баню",
    "seoTitle": "Как подготовить участок под мобильную баню | BANGER.SU",
    "metaDescription": "Место установки, подъезд, отвод воды и подготовка площадки для разгрузки.",
    "excerpt": "Место установки, подъезд, отвод воды и подготовка площадки для разгрузки.",
    "category": "Монтаж",
    "date": "",
    "readTime": 2,
    "content": "<p>Готовая мобильная баня приезжает на участок крупным модулем. Чтобы установка прошла без лишних работ, нужно заранее проверить не только место под баню, но и весь путь от дороги до фундамента. Начинать подготовку лучше до изготовления модуля: размеры выбранной модели уже влияют на условия доставки.</p>\n<h2 id=\"section-1\">Где расположить баню</h2>\n<p>Оцените рельеф, положение существующих строений, границы участка, подземные коммуникации и линии электропередачи. Проверьте применимые противопожарные и градостроительные требования для вашего участка. На низком месте важно заранее продумать, куда будут уходить осадки и вода из бани. Пространство под модулем должно оставаться доступным для осмотра, а древесина основания — защищённой от контакта с мокрым грунтом.</p>\n<h2 id=\"section-3\">Подъезд и место для техники</h2>\n<p>Измерьте ширину ворот и проездов, обратите внимание на повороты, ветки, провода и состояние дорожного покрытия. Отправьте производителю фотографии подъезда, участка и предполагаемого места разгрузки. Уточните, нужна ли отдельная крановая техника: её рабочая зона, допустимый вылет стрелы и возможность выставить опоры определяются специалистом с учётом массы модуля и грунта. Нельзя планировать работу стрелы возле ЛЭП без соблюдения требований безопасности.</p>\n<h2 id=\"section-5\">Что подготовить до приезда</h2>\n<p>Согласуйте схему фундамента именно под вашу модель, отметку верха опор и место ввода электричества и воды. Если предусмотрен душ или проливной пол, предусмотрите законный отвод стоков и доступ для обслуживания. Проверьте готовность фундамента, свободный проход вокруг площадки и наличие ключей от ворот. Не оставляйте под местом разгрузки садовую мебель и технику.</p>\n<p>При сомнениях лучше заранее организовать осмотр участка. Смена места установки в день доставки может потребовать другой техники и дополнительных затрат.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Где расположить баню",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Подъезд и место для техники",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Что подготовить до приезда",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "fundament-dlya-mobilnoy-bani-bloki-ili-svai",
      "dostavka-i-ustanovka-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/podgotovka-ploshchadki-pod-mobilnuyu-banyu.webp",
    "imageAlt": "Готовый модуль устанавливают на заранее подготовленное место с доступом для техники.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Готовый модуль устанавливают на заранее подготовленное место с доступом для техники.",
    "updatedAt": "2026-11-26",
    "presentation": "process"
  },
  {
    "id": "word-05",
    "slug": "fundament-dlya-mobilnoy-bani-bloki-ili-svai",
    "coverImage": "/images/articles/2026-11-26/fundament-dlya-mobilnoy-bani-bloki-ili-svai.webp",
    "coverAlt": "Пример опирания готового модуля; число, тип и расположение опор определяются проектом.",
    "title": "Блоки или винтовые сваи: какой фундамент выбрать для мобильной бани",
    "seoTitle": "Блоки или винтовые сваи: какой фундамент выбрать для мобильной бани | BANGER.SU",
    "metaDescription": "Когда подходят опорные блоки, когда стоит рассматривать сваи и почему опоры нельзя считать только по длине.",
    "excerpt": "Когда подходят опорные блоки, когда стоит рассматривать сваи и почему опоры нельзя считать только по длине.",
    "category": "Монтаж",
    "date": "",
    "readTime": 2,
    "content": "<p>Фундамент нужен не просто для того, чтобы поднять баню над землёй. Он передаёт нагрузки в грунт, удерживает геометрию модуля и помогает сохранить нормальную работу дверей, окон и сливов. Ошибка в основании может проявиться не сразу, а после сезонных перемещений грунта.</p>\n<h2 id=\"section-1\">Опорные блоки</h2>\n<p>Блоки могут быть вариантом для подходящих, устойчивых и подготовленных грунтов при расчётной схеме опирания. Важно, чтобы основание под ними не размывалось и не проседало неравномерно, а деревянная обвязка не соприкасалась с влажным грунтом. На пучинистом или слабом грунте простая установка блоков на поверхность без подготовки может привести к перекосу.</p>\n<h2 id=\"section-3\">Винтовые сваи</h2>\n<p>Сваи позволяют устроить опирание на подходящие слои грунта и выровнять верхние площадки на участке с перепадом высоты. Диаметр, длина, тип лопасти и защита металла зависят от грунта, нагрузок и расчёта. Винтовая свая не универсальна: каменистые грунты, препятствия, агрессивная среда и другие условия требуют оценки специалиста.</p>\n<h2 id=\"section-5\">Почему число опор индивидуально</h2>\n<p>Две бани одинаковой длины могут различаться массой, расположением печи, перегородок и несущих продольных балок. Поэтому количество опор и расстояния между ними определяют по схеме нижней обвязки, нагрузкам и несущей способности основания. До монтажа проверяют отметки верха оголовков, диагонали и их соответствие чертежу. Размеры оголовков должны обеспечивать правильную передачу нагрузки и предусмотренное крепление.</p>\n<p>Согласуйте фундамент с производителем бани и специалистом по основаниям до доставки. Иллюстрация показывает принцип двух решений, а не готовое свайное поле для любой модели.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Опорные блоки",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Винтовые сваи",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Почему число опор индивидуально",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "podgotovka-ploshchadki-pod-mobilnuyu-banyu",
      "dostavka-i-ustanovka-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/fundament-dlya-mobilnoy-bani-bloki-ili-svai.webp",
    "imageAlt": "Пример опирания готового модуля; число, тип и расположение опор определяются проектом.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Пример опирания готового модуля; число, тип и расположение опор определяются проектом.",
    "updatedAt": "2026-11-26",
    "presentation": "comparison"
  },
  {
    "id": "word-06",
    "slug": "karkas-ili-brus-dlya-bani",
    "coverImage": "/images/articles/2026-11-26/karkas-ili-brus-dlya-bani.webp",
    "coverAlt": "Слева — каркасная конструкция, справа — массивная брусовая стена.",
    "title": "Каркасная баня или баня из бруса: что отличается в эксплуатации",
    "seoTitle": "Каркасная баня или баня из бруса: что отличается в эксплуатации | BANGER.SU",
    "metaDescription": "Как различаются прогрев, влажностные деформации, вес и обслуживание двух технологий.",
    "excerpt": "Как различаются прогрев, влажностные деформации, вес и обслуживание двух технологий.",
    "category": "Конструкция",
    "date": "",
    "readTime": 2,
    "content": "<p>Обе технологии используют дерево, но устроены по-разному. В брусовой бане сама массивная стена одновременно несёт нагрузку и ограничивает теплопотери. В каркасной эти функции разделены между стойками, теплоизоляцией, мембранами и отделкой. Именно это определяет особенности эксплуатации.</p>\n<h2 id=\"section-1\">Как баня прогревается</h2>\n<p>Массив дерева накапливает тепло, поэтому непрогретую брусовую баню может потребоваться дольше выводить на режим. В каркасной конструкции значительную часть толщины стены занимает утеплитель, а внутренняя вагонка имеет сравнительно небольшую массу. Это удобно для периодических посещений, когда баня между выходными остывает. Фактическое время прогрева зависит от толщины и влажности стен, печи, объёма парной, остекления и погоды.</p>\n<h2 id=\"section-3\">Что происходит с древесиной</h2>\n<p>Брус естественной влажности заметно меняет размеры при высыхании. Возможны усушка, трещины и изменение зазоров в стыках. Даже сухой брус реагирует на сезонные изменения влажности. Для проёмов и отделки это нужно учитывать. Каркас из подготовленной древесины обычно позволяет точнее держать геометрию, но также может деформироваться при намокании или неправильной сборке. Его скрытые слои особенно важно защищать от влаги.</p>\n<h2 id=\"section-5\">Вес и обслуживание</h2>\n<p>Каркасный модуль часто легче массивного здания сопоставимых размеров, что удобно при доставке. Но точную массу считают по комплектации. У обоих вариантов деревянный фасад требует защиты, а печь — безопасного обслуживания. У каркасной бани важна герметичность мембран и вентиляция, у брусовой — состояние межвенцовых стыков и компенсирующих узлов.</p>\n<p>Выбирать стоит не по одному материалу, а по условиям использования. Сегодня BANGER предлагает каркасные мобильные бани; сравнение с брусом помогает понять причины такого выбора, а не означает, что брусовые модели входят в каталог.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Как баня прогревается",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Что происходит с древесиной",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Вес и обслуживание",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "pochemu-karkasnaya-banya",
      "materialy-dlya-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/karkas-ili-brus-dlya-bani.webp",
    "imageAlt": "Слева — каркасная конструкция, справа — массивная брусовая стена.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Слева — каркасная конструкция, справа — массивная брусовая стена.",
    "updatedAt": "2026-11-26",
    "presentation": "comparison"
  },
  {
    "id": "word-07",
    "slug": "pirog-steny-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/pirog-steny-mobilnoy-bani.webp",
    "coverAlt": "Снаружи внутрь: облицовка, фасадная прослойка, ветровлагозащита, утеплённый каркас, фольгированная парозащита и внутренняя вагонка. Зазоры уточняют по проекту.",
    "title": "Пирог стены каркасной бани: утепление, фольга и защита от влаги",
    "seoTitle": "Пирог стены каркасной бани: утепление, фольга и защита от влаги | BANGER.SU",
    "metaDescription": "Понятный разрез стены парной: как работают отдельные слои и почему их нельзя менять местами.",
    "excerpt": "Понятный разрез стены парной: как работают отдельные слои и почему их нельзя менять местами.",
    "category": "Конструкция",
    "date": "",
    "readTime": 2,
    "content": "<p>В парной горячий влажный воздух контактирует со стенами, а снаружи зимой может быть мороз. Задача конструкции — удерживать тепло, ограничивать поступление пара в холодные слои и защищать дерево от длительного увлажнения. Для этого важна последовательность материалов, а не только их толщина.</p>\n<h2 id=\"section-1\">Изнутри наружу</h2>\n<p>Внутренняя вагонка образует отделанную поверхность. За ней может быть предусмотрен монтажный зазор на рейках: он защищает парозащитный слой при креплении отделки и создаёт воздушную прослойку для работы отражающей поверхности. Следующий слой в парной BANGER — фольгированная бумага. Все стыки и нахлёсты проклеиваются алюминиевым скотчем. Примыкания и проходки герметизируются совместимыми материалами с учётом температуры и требований пожарной безопасности.</p>\n<p>Далее находится деревянный каркас с минеральной ватой ISOVER или URSA толщиной 100 мм в стандартном исполнении. Утеплитель заполняет пространство между стойками без сквозных щелей. Снаружи предусмотрена ветровлагозащитная мембрана, подходящая для выбранной конструкции.</p>\n<h2 id=\"section-3\">Зачем зазор за фасадом</h2>\n<p>Если фасадная система предусматривает вентилируемую прослойку, она помогает отводить воду и высушивать пространство за наружной облицовкой. Её нельзя перекрывать так, чтобы воздух и вода не имели предусмотренного выхода. Наружная отделка — имитация бруса в базовых моделях. Фасадная прослойка не соединяет воздух парной с толщей стены и не заменяет вентиляцию помещения.</p>\n<h2 id=\"section-5\">Что особенно важно</h2>\n<p>Наибольшее внимание требуется углам, примыканиям к полу и потолку, откосам и вводам коммуникаций. Даже небольшие негерметичные участки способны пропускать влажный воздух внутрь конструкции. Фольга не является противопожарным экраном, а мембраны не заменяют гидроизоляцию в мокрых зонах. На иллюстрации показан принцип слоёв; точная обрешётка и размеры зазоров определяются проектом конкретной бани.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Изнутри наружу",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Зачем зазор за фасадом",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Что особенно важно",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "materialy-dlya-mobilnoy-bani",
      "ventilyatsiya-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/pirog-steny-mobilnoy-bani.webp",
    "imageAlt": "Снаружи внутрь: облицовка, фасадная прослойка, ветровлагозащита, утеплённый каркас, фольгированная парозащита и внутренняя вагонка. Зазоры уточняют по проекту.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Снаружи внутрь: облицовка, фасадная прослойка, ветровлагозащита, утеплённый каркас, фольгированная парозащита и внутренняя вагонка. Зазоры уточняют по проекту.",
    "updatedAt": "2026-11-26",
    "presentation": "anatomy"
  },
  {
    "id": "word-08",
    "slug": "uteplenie-mobilnoy-bani-dlya-zimy",
    "coverImage": "/images/articles/2026-11-26/uteplenie-mobilnoy-bani-dlya-zimy.webp",
    "coverAlt": "Утепление стен, потолка и пола — часть единого теплового контура.",
    "title": "Как утеплить мобильную баню для зимы: стены, пол и потолок",
    "seoTitle": "Как утеплить мобильную баню для зимы: стены, пол и потолок | BANGER.SU",
    "metaDescription": "Что влияет на прогрев в мороз и почему нельзя оценивать зимнюю баню только по утеплению стен.",
    "excerpt": "Что влияет на прогрев в мороз и почему нельзя оценивать зимнюю баню только по утеплению стен.",
    "category": "Конструкция",
    "date": "",
    "readTime": 2,
    "content": "<p>Зимой баня должна не только набрать комфортную температуру, но и удерживать её в течение отдыха. На это влияют сразу несколько элементов: теплоизоляция стен, потолка и пола, герметичность проёмов, печь и управляемый воздухообмен. Усиление одной стены не исправит холодный пол или негерметичную дверь.</p>\n<h2 id=\"section-1\">Где теряется тепло</h2>\n<p>Тепло уходит через все ограждающие поверхности. Под потолком температура воздуха часто выше, поэтому качество потолочного утепления и примыканий особенно заметно при прогреве. Пол охлаждается наружным воздухом под модулем; здесь важны защита утеплителя от продувания и отсутствие неконтролируемых щелей. Окна и двери с большой площадью остекления обычно увеличивают тепловую нагрузку на печь.</p>\n<h2 id=\"section-3\">Что предусмотрено в базовой комплектации</h2>\n<p>В стенах, полу и потолке стандартных каркасных бань BANGER применяется минеральная вата ISOVER или URSA толщиной 100 мм. При правильном монтаже, герметичной пароизоляции и защите от ветра такой слой снижает потери тепла. Но одинаковая толщина не означает одинаковый результат для всех регионов, ветровых условий и режимов отопления. Для регулярной эксплуатации в сильные морозы и для постоянно тёплого помещения решение выбирают с учётом расчёта.</p>\n<h2 id=\"section-5\">Как подготовиться к зиме</h2>\n<p>Согласуйте мощность печи по объёму парной и остеклению, уточните устройство пола и сливов, возможность полного опорожнения водяных линий. Осмотрите уплотнения наружной двери, проверьте, что вентиляционные отверстия свободны. После банных процедур не оставляйте воду в системе, которая может замёрзнуть; порядок слива зависит от оборудования. Не закрывайте вентиляцию ради экономии дров вопреки инструкции печи.</p>\n<p>Комфорт зимой определяется не одной толщиной утеплителя, а всей системой: от основания до потолка и безопасного режима использования.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Где теряется тепло",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Что предусмотрено в базовой комплектации",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Как подготовиться к зиме",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "uteplenie-isover-ursa-bani",
      "pochemu-ne-ispolzuem-epps-v-polu"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/uteplenie-mobilnoy-bani-dlya-zimy.webp",
    "imageAlt": "Утепление стен, потолка и пола — часть единого теплового контура.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Утепление стен, потолка и пола — часть единого теплового контура.",
    "updatedAt": "2026-11-26",
    "presentation": "reference"
  },
  {
    "id": "word-09",
    "slug": "pol-i-sliv-v-bane",
    "coverImage": "/images/articles/2026-11-26/pol-i-sliv-v-bane.webp",
    "coverAlt": "Водосборная поверхность направляет воду к трапу под деревянным настилом.",
    "title": "Пол и слив в бане: как организовать отвод воды",
    "seoTitle": "Пол и слив в бане: как организовать отвод воды | BANGER.SU",
    "metaDescription": "Путь воды от поверхности до места отвода, уклоны, гидроизоляция и защита от запаха.",
    "excerpt": "Путь воды от поверхности до места отвода, уклоны, гидроизоляция и защита от запаха.",
    "category": "Конструкция",
    "date": "",
    "readTime": 2,
    "content": "<p>Вода, которая попадает на пол во время мытья и парения, должна уходить предсказуемо. Если она задерживается в углах или проникает к лагам, древесина долго остаётся влажной. Поэтому систему водоотведения стоит выбрать ещё до изготовления бани.</p>\n<h2 id=\"section-1\">Сухой пол и мокрая зона</h2>\n<p>В комнате отдыха обычно достаточно обычного утеплённого деревянного пола. В парной и особенно в помывочной количество воды может быть больше. Если планируется регулярное проливание воды, предусматривают соответствующую гидроизоляцию и организованный слив. Нельзя считать, что щели между досками сами по себе обеспечат безопасный отвод: вода должна попадать на предназначенную для этого водосборную поверхность, а не на утеплитель или открытые лаги.</p>\n<h2 id=\"section-3\">Как работает слив</h2>\n<p>Водосборный слой имеет уклон к трапу или другому предусмотренному водоприёмнику. Гидроизоляцию герметично сопрягают со стенами и сливным узлом. Трубопровод отводит воду в согласованную систему, подходящую для участка. Наличие сухого затвора может быть полезно там, где водяной затвор пересыхает между посещениями: механический элемент препятствует поступлению запаха при отсутствии воды. Но сухой затвор не заменяет защиту труб от промерзания и требует обслуживания.</p>\n<h2 id=\"section-5\">Доступ к уборке и зимняя эксплуатация</h2>\n<p>Удобный пол позволяет осмотреть трап, удалить волосы, песок и листья, промыть поверхность и просушить её. Для этого хорошо подходят съёмные или подъёмные деревянные щиты, если такое решение предусмотрено проектом. Вода не должна стоять в недоступных полостях. Перед зимним простоем необходимо выполнить слив системы по инструкции, а саму баню просушить.</p>\n<p>При заказе уточните, что именно входит в комплектацию: деревянный настил, гидроизоляция, трап, сухой затвор, разводка и конечная точка отвода стоков — это разные элементы.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Сухой пол и мокрая зона",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Как работает слив",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Доступ к уборке и зимняя эксплуатация",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "prolivnoy-pol-v-bane",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/pol-i-sliv-v-bane.webp",
    "imageAlt": "Водосборная поверхность направляет воду к трапу под деревянным настилом.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Водосборная поверхность направляет воду к трапу под деревянным настилом.",
    "updatedAt": "2026-11-26",
    "presentation": "process"
  },
  {
    "id": "word-10",
    "slug": "ventilyatsiya-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/ventilyatsiya-mobilnoy-bani.webp",
    "coverAlt": "Парная с выносной топкой. Приток и вытяжку размещают по инструкции печи и проекту вентиляции.",
    "title": "Вентиляция бани: как сохранить комфортный пар и просушить помещение",
    "seoTitle": "Вентиляция бани: как сохранить комфортный пар и просушить помещение | BANGER.SU",
    "metaDescription": "Приток, вытяжка и два режима воздухообмена: при парении и после него.",
    "excerpt": "Приток, вытяжка и два режима воздухообмена: при парении и после него.",
    "category": "Эксплуатация",
    "date": "",
    "readTime": 2,
    "content": "<p>В хорошей парной тепло ощущается равномерно, а после банных процедур дерево не остаётся мокрым на несколько дней. На оба результата влияет вентиляция. Она должна обеспечивать свежий воздух во время посещения и помогать удалять влажный воздух после него, не создавая опасного разрежения возле дровяной печи.</p>\n<h2 id=\"section-1\">Как движется воздух</h2>\n<p>Приточное отверстие подаёт свежий воздух, а вытяжное удаляет часть воздуха из помещения. В естественной системе движение возникает из-за различия температур и давления. В парной с дровяной печью одна из распространённых схем естественной вентиляции предусматривает приток в нижней части возле печи и удаление влажного воздуха выше, вдали от неё. При выносной топке воздух для горения подают в смежное помещение согласно инструкции печи. При механической вентиляции расположение отверстий может быть другим. Конкретную схему выбирают по инструкции печи и планировке: нельзя просто копировать положение решёток из чужой бани.</p>\n<h2 id=\"section-3\">Во время парения</h2>\n<p>Не перекрывайте предусмотренный приток воздуха, особенно когда работает дровяная печь. Ей необходимо достаточное количество воздуха для горения; неправильная работа вытяжки может нарушить тягу. Регулируйте заслонки только в пределах предусмотренной схемы. Сильный поток холодного воздуха в зоне полков ухудшает комфорт, но полное перекрытие вентиляции — не решение. При признаках обратной тяги, дыме или подозрении на угарный газ немедленно покиньте помещение и прекратите эксплуатацию до проверки специалистом.</p>\n<h2 id=\"section-5\">После парения</h2>\n<p>Удалите воду с пола, поднимите съёмные щиты, если они предусмотрены, и используйте режим интенсивного проветривания согласно устройству бани. Остаточное тепло помогает испарению, а воздухообмен выводит влагу наружу. В мойке нужно удалять влажный воздух, не направляя его в холодные конструкции; в комнате отдыха — избегать устойчивого конденсата на окнах и сырости. Вентиляция помещения и фасадный вентиляционный зазор выполняют разные задачи.</p>\n<p>Если на следующее утро после посещения на стенах и под полками сохраняется влага, проверьте, свободны ли предусмотренные отверстия, не перекрыты ли заслонки и достаточно ли времени отведено на просушку. Устойчивая сырость может быть связана не только с вентиляцией, но и с протечкой или неисправным сливом. Режимы работы лучше согласовать ещё при выборе планировки. Тогда баней будет удобно пользоваться и летом, и зимой.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Как движется воздух",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Во время парения",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "После парения",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "pirog-steny-mobilnoy-bani",
      "voda-i-boyler-v-mobilnoy-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/ventilyatsiya-mobilnoy-bani.webp",
    "imageAlt": "Парная с выносной топкой. Приток и вытяжку размещают по инструкции печи и проекту вентиляции.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Парная с выносной топкой. Приток и вытяжку размещают по инструкции печи и проекту вентиляции.",
    "updatedAt": "2026-11-26",
    "presentation": "anatomy"
  },
  {
    "id": "word-11",
    "slug": "kak-vybrat-pech-dlya-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/kak-vybrat-pech-dlya-mobilnoy-bani.webp",
    "coverAlt": "Корпус печи находится в парной; загрузка дров — через топочный канал из смежного помещения.",
    "title": "Как выбрать печь для мобильной бани",
    "seoTitle": "Как выбрать печь для мобильной бани | BANGER.SU",
    "metaDescription": "Объём парной, мощность, каменка, остекление и удобство топки.",
    "excerpt": "Объём парной, мощность, каменка, остекление и удобство топки.",
    "category": "Печи и пар",
    "date": "",
    "readTime": 2,
    "content": "<p>Печь выбирают для парной, а не по общей длине бани. В двух модулях размером шесть метров объём парной может различаться, как и площадь стеклянных дверей, утепление, высота потолка и предпочтительный режим парения. Поэтому подходящий тип печи определяется не только её внешним видом.</p>\n<h2 id=\"section-1\">Начните с объёма парной</h2>\n<p>Измерьте длину, ширину и высоту помещения. Полученный геометрический объём сравните с диапазоном, указанным в паспорте печи. Производитель может требовать поправку на неутеплённые поверхности, стекло и другие теплопотери — пользуйтесь именно его методикой. Не следует выбирать печь с большим запасом мощности без расчёта: воздух может стать слишком горячим раньше, чем прогреются камни и поверхности. Недостаточная мощность приводит к длительной работе на высокой нагрузке.</p>\n<h2 id=\"section-3\">Каменка, топка и вода</h2>\n<p>Открытая каменка позволяет напрямую подавать воду на камни. Закрытая может иметь иной характер нагрева и подачи воды. Сравните допустимую массу и размер камней, устройство выносного топочного канала и возможность подключения бака. В банях BANGER корпус печи находится в парной, а дрова загружают из помывочной или комнаты отдыха, в зависимости от планировки. Панорамная дверца украшает интерьер, но не определяет мощность или качество пара. Чугунные и стальные печи отличаются конструкцией, массой и режимом эксплуатации; конкретную модель оценивают по паспорту.</p>\n<h2 id=\"section-5\">Безопасность важнее дизайна</h2>\n<p>До выбора печи нужно проверить, помещаются ли она, защитные экраны и дымоход с соблюдением необходимых расстояний, а основание выдерживает нагрузку. Монтаж и первый пуск выполняют согласно инструкции и применимым нормам. В базе BANGER предусмотрена печь «Ермак» с дымоходом; точная модель зависит от комплектации. Другую печь можно согласовать при заказе.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Начните с объёма парной",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Каменка, топка и вода",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Безопасность важнее дизайна",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "dymohod-v-derevyannoy-bane",
      "otkrytaya-ili-zakrytaya-kamenka",
      "parovaya-pushka-v-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/kak-vybrat-pech-dlya-mobilnoy-bani.webp",
    "imageAlt": "Корпус печи находится в парной; загрузка дров — через топочный канал из смежного помещения.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Корпус печи находится в парной; загрузка дров — через топочный канал из смежного помещения.",
    "updatedAt": "2026-11-26",
    "presentation": "comparison"
  },
  {
    "id": "word-12",
    "slug": "dymohod-v-derevyannoy-bane",
    "coverImage": "/images/articles/2026-11-26/dymohod-v-derevyannoy-bane.webp",
    "coverAlt": "Дымоход и потолочный проход: внешний вид не подтверждает правильность скрытой разделки.",
    "title": "Дымоход в деревянной бане: безопасный проход потолка и кровли",
    "seoTitle": "Дымоход в деревянной бане: безопасный проход потолка и кровли | BANGER.SU",
    "metaDescription": "Зачем нужны противопожарные расстояния, проходные узлы и регулярный контроль дымохода.",
    "excerpt": "Зачем нужны противопожарные расстояния, проходные узлы и регулярный контроль дымохода.",
    "category": "Безопасность",
    "date": "",
    "readTime": 2,
    "content": "<p>Дымоход отводит горячие продукты сгорания за пределы бани. В деревянном строении особенно важны участки возле стен, потолка и кровли: при длительном нагреве дерево может становиться более восприимчивым к возгоранию. Внешне аккуратный дымоход не гарантирует безопасного устройства скрытого прохода.</p>\n<h2 id=\"section-1\">Почему нельзя сокращать расстояния</h2>\n<p>Металлическая труба нагревается при работе печи, а температура зависит от режима горения и конструкции системы. Даже утеплённый дымоход типа «сэндвич» требует предусмотренного производителем расстояния до горючих материалов. Проходной узел должен соответствовать документации печи и дымохода, действующим противопожарным требованиям и конструкции перекрытия. Случайные материалы, монтажная пена и обычная фольга не являются заменой подходящего сертифицированного решения.</p>\n<h2 id=\"section-3\">Проход кровли и обслуживание</h2>\n<p>Кровельное примыкание защищают от осадков, учитывая температурные перемещения трубы. Нельзя смешивать гидроизоляцию кровли с противопожарной разделкой потолка: это разные функции. Система должна обеспечивать возможность осмотра и очистки. Высоту, положение относительно кровли, крепление и допустимые участки соединения определяют по проекту и инструкции производителя. Не используйте картинку из интернета как монтажный чертёж.</p>\n<h2 id=\"section-5\">Когда нужна проверка</h2>\n<p>Осматривайте печь и дымоход перед началом сезона и в ходе эксплуатации по регламенту производителя. Повреждение трубы, потемнение древесины рядом с узлом, дым в помещении, запах гари или ухудшение тяги — повод прекратить топку и обратиться к специалисту. При подозрении на пожар или отравление угарным газом покиньте баню и вызовите экстренную помощь.</p>\n<p>При заказе уточняйте, какая дымоходная система и защитные узлы входят в комплектацию. Монтаж должен быть проверен квалифицированным специалистом.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Почему нельзя сокращать расстояния",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Проход кровли и обслуживание",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Когда нужна проверка",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "kak-vybrat-pech-dlya-mobilnoy-bani",
      "elektrika-v-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/dymohod-v-derevyannoy-bane.webp",
    "imageAlt": "Дымоход и потолочный проход: внешний вид не подтверждает правильность скрытой разделки.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Дымоход и потолочный проход: внешний вид не подтверждает правильность скрытой разделки.",
    "updatedAt": "2026-11-26",
    "presentation": "checklist"
  },
  {
    "id": "word-13",
    "slug": "elektrika-v-bane",
    "coverImage": "/images/articles/2026-11-26/elektrika-v-bane.webp",
    "coverAlt": "Пример освещения деревянной парной; оборудование выбирают по температуре и влажности.",
    "title": "Электрика в бане: безопасный свет, розетки и защита",
    "seoTitle": "Электрика в бане: безопасный свет, розетки и защита | BANGER.SU",
    "metaDescription": "Почему парная, помывочная и комната отдыха требуют разных решений по электрике.",
    "excerpt": "Почему парная, помывочная и комната отдыха требуют разных решений по электрике.",
    "category": "Безопасность",
    "date": "",
    "readTime": 2,
    "content": "<p>В бане электрическое оборудование работает рядом с влажными поверхностями, горячим воздухом и деревянной отделкой. Обычная домашняя розетка или светильник не обязательно подходит для таких условий. Поэтому электросистему выбирают не только по внешнему виду, но и по месту её установки.</p>\n<h2 id=\"section-1\">Разные помещения — разные требования</h2>\n<p>В парной температура значительно меняется по высоте и возле печи. Кабель, светильники и другие элементы должны соответствовать допустимому температурному режиму своего места установки. Розетки и выключатели обычно размещают вне парной, в предусмотренных проектом зонах. В помывочной учитывают возможность попадания воды, расположение душа и требования к степени защиты оборудования. В комнате отдыха условия мягче, но она остаётся частью деревянного модуля.</p>\n<h2 id=\"section-3\">Защитные устройства</h2>\n<p>Питание выполняют с предусмотренным защитным заземлением, аппаратами защиты от перегрузок и короткого замыкания и устройствами дифференциальной защиты там, где они требуются. Номиналы определяют по расчётной нагрузке, кабелю, системе питания и действующим правилам. Нельзя самостоятельно увеличивать номинал автомата, если он срабатывает. Особенно важно учесть бойлер и другие мощные приборы, если они входят в индивидуальную комплектацию.</p>\n<h2 id=\"section-5\">Открытая и скрытая электрика</h2>\n<p>В стандартной комплектации BANGER предусмотрена открытая электрика. Скрытая разводка согласовывается отдельно с учётом безопасной прокладки в деревянных конструкциях. Расположение точек и освещения лучше определить до отделки. Подсветка полков должна быть предназначена для соответствующих температур и влажности; блоки питания и соединения размещают в допустимых местах.</p>\n<p>Подключение и проверку должен выполнять квалифицированный электрик. Если появляется запах перегретого кабеля, искрение, следы нагрева или повторное срабатывание защиты, отключите питание и не используйте оборудование до проверки.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Разные помещения — разные требования",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Защитные устройства",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Открытая и скрытая электрика",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "voda-i-boyler-v-mobilnoy-bane",
      "kak-prinyat-mobilnuyu-banyu"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/elektrika-v-bane.webp",
    "imageAlt": "Пример освещения деревянной парной; оборудование выбирают по температуре и влажности.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Пример освещения деревянной парной; оборудование выбирают по температуре и влажности.",
    "updatedAt": "2026-11-26",
    "presentation": "checklist"
  },
  {
    "id": "word-14",
    "slug": "voda-i-boyler-v-mobilnoy-bane",
    "coverImage": "/images/articles/2026-11-26/voda-i-boyler-v-mobilnoy-bane.webp",
    "coverAlt": "Душевая зона мобильной бани; ввод воды, нагрев и слив согласовывают при заказе.",
    "title": "Вода, душ и бойлер в мобильной бане: удобство летом и зимой",
    "seoTitle": "Вода, душ и бойлер в мобильной бане: удобство летом и зимой | BANGER.SU",
    "metaDescription": "Как предусмотреть ввод воды, нагрев, обслуживание и слив при морозах.",
    "excerpt": "Как предусмотреть ввод воды, нагрев, обслуживание и слив при морозах.",
    "category": "Инженерные системы",
    "date": "",
    "readTime": 2,
    "content": "<p>Душ позволяет использовать мобильную баню не только для парения, но и для полноценного отдыха. При этом вода требует заранее продуманной системы: подводки, нагрева, слива и защиты от замерзания. Выбор бойлера — лишь одна часть задачи.</p>\n<h2 id=\"section-1\">Подвод воды и нагрев</h2>\n<p>Вода может поступать из дома, скважины или другой подходящей системы. Давление, качество воды, подключение и способ управления определяют по условиям участка. Накопительный бойлер выбирают по числу пользователей и ожидаемому расходу. Чем больше объём, тем больше места и нагрузка на крепления; важно также учитывать электрическую мощность. Проточный нагреватель обычно предъявляет повышенные требования к доступной мощности сети. Встроенный бак печи и электрический бойлер — разные решения, их комплектацию согласовывают отдельно.</p>\n<h2 id=\"section-3\">Что важно при монтаже</h2>\n<p>Бойлер, его крепление, защитная арматура и электрическое питание должны соответствовать инструкции оборудования. Соединения и запорные краны необходимо оставить доступными для обслуживания. Для душа предусматривают водостойкую отделку мокрой зоны, водосборную поверхность и слив в согласованную систему. Трубы нельзя располагать произвольно вблизи горячих деталей печи или в местах, где их невозможно осмотреть.</p>\n<h2 id=\"section-5\">Как избежать замерзания</h2>\n<p>Если баня зимой остаётся без отопления, вода в трубах, смесителе, фильтрах, бойлере и трапе может замёрзнуть. Продумайте возможность полного опорожнения в соответствии с документацией каждого прибора. Утепление труб лишь замедляет охлаждение и не гарантирует защиту при длительном морозе. Греющий кабель, если он предусмотрен, требует подходящего исполнения и безопасного питания.</p>\n<p>Перед включением накопительного электрического бойлера убедитесь, что он заполнен водой согласно инструкции. При заказе индивидуальной комплектации заранее согласуйте способ подключения, объём бойлера, слив и режим зимнего обслуживания.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Подвод воды и нагрев",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Что важно при монтаже",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Как избежать замерзания",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "pol-i-sliv-v-bane",
      "ventilyatsiya-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/voda-i-boyler-v-mobilnoy-bane.webp",
    "imageAlt": "Душевая зона мобильной бани; ввод воды, нагрев и слив согласовывают при заказе.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Душевая зона мобильной бани; ввод воды, нагрев и слив согласовывают при заказе.",
    "updatedAt": "2026-11-26",
    "presentation": "process"
  },
  {
    "id": "word-15",
    "slug": "otdelka-parnoy-i-polki",
    "coverImage": "/images/articles/2026-11-26/otdelka-parnoy-i-polki.webp",
    "coverAlt": "Деревянная вагонка и полки; породу древесины и размеры подбирают под проект.",
    "title": "Чем отделывать парную: осина, липа и хвойная древесина",
    "seoTitle": "Чем отделывать парную: осина, липа и хвойная древесина | BANGER.SU",
    "metaDescription": "Выбор вагонки и полков, особенности липы и осины, удобство и уход за древесиной.",
    "excerpt": "Выбор вагонки и полков, особенности липы и осины, удобство и уход за древесиной.",
    "category": "Материалы",
    "date": "",
    "readTime": 2,
    "content": "<p>В парной древесина контактирует с горячим воздухом, паром и кожей. Поэтому выбор отделки отличается от выбора фасадной доски. Для полков особенно важны гладкая поверхность, умеренный нагрев и отсутствие дефектов, способных травмировать человека.</p>\n<h2 id=\"section-1\">Осина и липа</h2>\n<p>Осина и липа широко применяются в парных. Они не имеют характерных для многих хвойных пород смоляных карманов и подходят для поверхностей, к которым человек прикасается. Осина обычно имеет светлый, спокойный оттенок; липа ценится за мягкую текстуру и тёплый рисунок. Обе породы требуют регулярной сушки и ухода. Класс отделки отражает допустимые визуальные особенности по правилам конкретного производителя и не является гарантией прочности.</p>\n<p>В стандартных моделях BANGER парная отделывается осиной класса А, полки также из осины. В реализованной «Скандинавии» 6 × 2,6 м по индивидуальному заказу использована вагонка из липы класса АВ с естественными узорами, липовые полки и выдвижная лавочка. Это особенность конкретного проекта, а не стандарт всей линейки.</p>\n<h2 id=\"section-3\">Где уместна хвойная вагонка</h2>\n<p>Хвойная древесина хорошо подходит для комнаты отдыха и других помещений с менее высокой температурой. В парной некоторые хвойные материалы могут выделять нагретую смолу, поэтому их выбор требует особого внимания к породе, сорту и расположению поверхности. В базовой комплектации BANGER для парной применяется отдельная осиновая отделка.</p>\n<h2 id=\"section-5\">Удобные полки и уход</h2>\n<p>Полки должны выдерживать предусмотренную нагрузку, иметь гладкие кромки, безопасный крепёж и удобный доступ для уборки. Высоту, ширину и число уровней подбирают по планировке и потребностям пользователей. Не покрывайте полки обычным лаком или случайным антисептиком: выбирайте средства, разрешённые для контакта с кожей в условиях парной. После использования удаляйте влагу и просушивайте древесину.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Осина и липа",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Где уместна хвойная вагонка",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Удобные полки и уход",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "obrabotka-drevesiny-neomid-v-bane",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/otdelka-parnoy-i-polki.webp",
    "imageAlt": "Деревянная вагонка и полки; породу древесины и размеры подбирают под проект.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Деревянная вагонка и полки; породу древесины и размеры подбирают под проект.",
    "updatedAt": "2026-11-26",
    "presentation": "reference"
  },
  {
    "id": "word-16",
    "slug": "okna-i-dveri-v-bane",
    "coverImage": "/images/articles/2026-11-26/okna-i-dveri-v-bane.webp",
    "coverAlt": "Наружные окна и входная дверь — часть теплового контура бани.",
    "title": "Окна и двери в бане: свет, остекление и сохранение тепла",
    "seoTitle": "Окна и двери в бане: свет, остекление и сохранение тепла | BANGER.SU",
    "metaDescription": "Как выбрать остекление, входную дверь и дверь парной без лишних теплопотерь.",
    "excerpt": "Как выбрать остекление, входную дверь и дверь парной без лишних теплопотерь.",
    "category": "Материалы",
    "date": "",
    "readTime": 2,
    "content": "<p>Большое окно делает комнату отдыха светлее, а стеклянная дверь визуально расширяет пространство. Однако у бани есть особые условия: высокая влажность, перепады температуры и регулярное охлаждение между посещениями. Остекление нужно выбирать вместе с конструкцией проёмов и назначением помещения.</p>\n<h2 id=\"section-1\">Окна и наружная дверь</h2>\n<p>В стандартной комплектации BANGER предусмотрены белые окна и двери по планировке. Цветная ламинация, панорамное остекление, тонировка и другие варианты согласовываются отдельно. Теплопотери зависят от площади, стеклопакета, профиля, уплотнителей и качества установки. Одного красивого цвета профиля недостаточно для оценки энергоэффективности. Важно, чтобы рама была правильно установлена, а примыкания к стене защищены от проникновения влаги и продувания.</p>\n<h2 id=\"section-3\">Дверь парной</h2>\n<p>Дверь должна подходить к условиям высокой температуры и влажности. Если выбирается стеклянная модель, она должна быть специально предназначена для сауны или бани, с подходящим безопасным стеклом и фурнитурой. Дверь должна открываться в предусмотренном безопасном направлении и не иметь запирающего устройства, мешающего человеку быстро выйти из парной. Обычная наружная ПВХ-дверь не является автоматической заменой двери парной.</p>\n<h2 id=\"section-5\">Конденсат и обслуживание</h2>\n<p>Запотевание стекла возникает при охлаждении влажного воздуха у поверхности. Кратковременный конденсат после парения возможен, но постоянная влага на откосах — повод проверить вентиляцию и монтаж. Протирайте мокрые поверхности, просушивайте помещение и следите за состоянием уплотнителей. Увеличение площади остекления может потребовать поправки при подборе мощности печи.</p>\n<p>Панорамное окно особенно приятно в комнате отдыха с хорошим видом. Продумайте расположение относительно соседей, участка и солнца: тонировка не всегда гарантирует приватность, особенно вечером при включённом освещении внутри.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Окна и наружная дверь",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Дверь парной",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Конденсат и обслуживание",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "fasad-mobilnoy-bani",
      "materialy-dlya-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/okna-i-dveri-v-bane.webp",
    "imageAlt": "Наружные окна и входная дверь — часть теплового контура бани.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Наружные окна и входная дверь — часть теплового контура бани.",
    "updatedAt": "2026-11-26",
    "presentation": "anatomy"
  },
  {
    "id": "word-17",
    "slug": "fasad-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/fasad-mobilnoy-bani.webp",
    "coverAlt": "Деревянная облицовка и графитовые элементы фасада.",
    "title": "Фасад мобильной бани: древесина, цвет и защита от погоды",
    "seoTitle": "Фасад мобильной бани: древесина, цвет и защита от погоды | BANGER.SU",
    "metaDescription": "Имитация бруса, графитовые детали, покрытия и уход за наружной отделкой.",
    "excerpt": "Имитация бруса, графитовые детали, покрытия и уход за наружной отделкой.",
    "category": "Материалы",
    "date": "",
    "readTime": 2,
    "content": "<p>Фасад задаёт характер бани, но его задача не только эстетическая. Наружная древесина регулярно испытывает действие солнца, дождя, снега и изменения влажности. Даже качественная доска требует правильно устроенных примыканий, подходящего покрытия и обслуживания.</p>\n<h2 id=\"section-1\">Выбор наружной отделки</h2>\n<p>В базовых каркасных моделях BANGER применяется имитация бруса. Её профиль образует выразительные горизонтальные линии и закрывает конструктивные слои. Планкен, блок-хаус и другие варианты можно обсуждать как индивидуальное исполнение. Для каждого профиля важны свои правила крепления и зазоров: нельзя автоматически заменять одну облицовку другой, оставляя прежнюю схему монтажа.</p>\n<h2 id=\"section-3\">Цвет и защита древесины</h2>\n<p>Тонирующие покрытия подчёркивают природный рисунок дерева. Укрывные составы дают более равномерный цвет и могут быть удобны для современных графитовых фасадов. Итоговый оттенок зависит от породы, подготовки доски, числа слоёв, партии материала и освещения. Цвет на рендере или экране может отличаться от реального образца. Лучше согласовать выкраску перед нанесением, а цвет наличников, профлиста, окон и дверей проверять отдельно: один код RAL не гарантирует одинаковое восприятие разных материалов.</p>\n<h2 id=\"section-5\">Как фасад сохраняет внешний вид</h2>\n<p>За наружной облицовкой предусматривают защиту от ветра и влаги и, где это требуется фасадной системой, вентилируемую прослойку. Крепёж должен быть пригоден для наружной эксплуатации. Свесы крыши, отливы и примыкания отводят осадки от уязвимых участков. Регулярно осматривайте торцы, нижнюю часть фасада, наличники и места, где может задерживаться вода. Обновляйте покрытие по инструкции его производителя, не дожидаясь глубокого разрушения древесины.</p>\n<p>Выбирая цвет, учитывайте окружающие строения и освещение участка: тёплая древесина и графитовые элементы хорошо подчёркивают лаконичную форму мобильной бани.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Выбор наружной отделки",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Цвет и защита древесины",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Как фасад сохраняет внешний вид",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "obrabotka-drevesiny-neomid-v-bane",
      "okna-i-dveri-v-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/fasad-mobilnoy-bani.webp",
    "imageAlt": "Деревянная облицовка и графитовые элементы фасада.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Деревянная облицовка и графитовые элементы фасада.",
    "updatedAt": "2026-11-26",
    "presentation": "immersive"
  },
  {
    "id": "word-18",
    "slug": "dostavka-i-ustanovka-mobilnoy-bani",
    "coverImage": "/images/articles/2026-11-26/dostavka-i-ustanovka-mobilnoy-bani.webp",
    "coverAlt": "Готовая каркасная баня на участке после установки — иллюстрация результата монтажа.",
    "title": "Как доставляют и устанавливают готовую мобильную баню",
    "seoTitle": "Как доставляют и устанавливают готовую мобильную баню | BANGER.SU",
    "metaDescription": "Что происходит от выезда с производства до установки на подготовленный фундамент.",
    "excerpt": "Что происходит от выезда с производства до установки на подготовленный фундамент.",
    "category": "Монтаж",
    "date": "",
    "readTime": 2,
    "content": "<p>Мобильная баня отличается от строительства на участке тем, что основная часть работ выполняется на производстве. Клиент получает готовый модуль, который необходимо безопасно перевезти, разгрузить и установить на подготовленное основание. Чтобы день монтажа прошёл без неожиданностей, условия доставки согласовывают заранее.</p>\n<h2 id=\"section-1\">Перед отправкой</h2>\n<p>Проверяют габариты и фактическую массу модуля, особенности маршрута, доступность участка, готовность фундамента и вид разгрузочной техники. При необходимости согласовывают перевозку крупногабаритного груза. Внутренние элементы и дверцы готовят к транспортировке по принятой технологии производителя. Клиенту важно сообщить о низких проводах, крутых поворотах, узких воротах, мягком грунте и ограничениях въезда.</p>\n<h2 id=\"section-3\">На участке</h2>\n<p>Монтажная бригада проверяет место установки, рабочую зону и опоры техники. Подъём выполняют за предусмотренные производителем точки с подходящим грузозахватным оборудованием. Способ строповки, грузоподъёмность и вылет определяются специалистами. Посторонние не должны находиться под грузом или в опасной зоне. После установки проверяют положение модуля на опорах, отметки и отсутствие перекоса; при необходимости выполняют предусмотренные крепления.</p>\n<h2 id=\"section-5\">Что входит в завершение работ</h2>\n<p>После размещения проверяют состояние фасада, проёмов, внутренней отделки и комплектации. Подключение электричества, воды и канализации выполняют в объёме, согласованном договором, квалифицированные специалисты. Установка модуля на фундамент не означает автоматическое подключение всех коммуникаций. Цена доставки и разгрузки рассчитывается по адресу, условиям подъезда и технике; в конкретном предложении они могут быть выделены отдельно или включены в стоимость под ключ.</p>\n<p>Проверьте вместе с представителем производителя готовность бани к эксплуатации и получите рекомендации по первому использованию. Не начинайте топку, пока не выполнены необходимые проверки печи, дымохода и вентиляции.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Перед отправкой",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "На участке",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Что входит в завершение работ",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "podgotovka-ploshchadki-pod-mobilnuyu-banyu",
      "kak-prinyat-mobilnuyu-banyu"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/dostavka-i-ustanovka-mobilnoy-bani.webp",
    "imageAlt": "Готовая каркасная баня на участке после установки — иллюстрация результата монтажа.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Готовая каркасная баня на участке после установки — иллюстрация результата монтажа.",
    "updatedAt": "2026-11-26",
    "presentation": "process"
  },
  {
    "id": "word-19",
    "slug": "kak-prinyat-mobilnuyu-banyu",
    "coverImage": "/images/articles/2026-11-26/kak-prinyat-mobilnuyu-banyu.webp",
    "coverAlt": "Комната отдыха: при приёмке проверяют отделку, окна, двери и комплектность.",
    "title": "Как принять готовую мобильную баню: чек-лист покупателя",
    "seoTitle": "Как принять готовую мобильную баню: чек-лист покупателя | BANGER.SU",
    "metaDescription": "Что осмотреть перед подписанием акта и какие документы получить.",
    "excerpt": "Что осмотреть перед подписанием акта и какие документы получить.",
    "category": "Покупка",
    "date": "",
    "readTime": 2,
    "content": "<p>Приёмка помогает убедиться, что установленная баня соответствует вашему заказу. Возьмите договор, спецификацию и согласованную планировку. Осмотр удобнее проводить при дневном свете, в присутствии представителя производителя. Оценивайте именно заказанную комплектацию: дополнительные опции не являются обязательными для каждой модели.</p>\n<h2 id=\"section-1\">Снаружи и на фундаменте</h2>\n<p>Проверьте габариты, расположение и ориентацию модуля, состояние отделки и кровли, отсутствие явных повреждений после доставки. Убедитесь, что опоры расположены по согласованной схеме, а модуль устойчив и не имеет заметного перекоса. Откройте и закройте входную дверь и окна: они не должны заедать. Осмотрите доступные примыкания, отливы и места креплений.</p>\n<h2 id=\"section-3\">Внутри бани</h2>\n<p>Сверьте материалы отделки, количество и расположение полков, дверей, светильников, розеток и заказанных опций. Проверьте ровность и гладкость поверхностей, устойчивость лавок и отсутствие выступающих острых деталей. Осмотрите доступные элементы вентиляции. Если предусмотрены проливной пол и трап, попросите показать доступ к сливу и порядок уборки; проверку водоотведения проводят при готовой системе и допустимых условиях.</p>\n<h2 id=\"section-5\">Печь, электрика и документы</h2>\n<p>Сверьте модель печи, комплект дымохода и защитных элементов. Попросите инструкции оборудования и уточните, кто проверяет безопасность монтажа и проводит первый пуск. Электрику и заземление должен проверить квалифицированный специалист; обычное включение света не заменяет электрических измерений. Получите документы на заказ, гарантийные условия и рекомендации по обслуживанию.</p>\n<p>Замечания фиксируйте в акте с фотографиями и согласованным сроком устранения. Не подписывайте подтверждение отсутствия замечаний, если они действительно есть. Вопросы, которые нельзя проверить при обычном осмотре, лучше заранее согласовать с производителем и профильными специалистами.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Снаружи и на фундаменте",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Внутри бани",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Печь, электрика и документы",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "dostavka-i-ustanovka-mobilnoy-bani",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/kak-prinyat-mobilnuyu-banyu.webp",
    "imageAlt": "Комната отдыха: при приёмке проверяют отделку, окна, двери и комплектность.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Комната отдыха: при приёмке проверяют отделку, окна, двери и комплектность.",
    "updatedAt": "2026-11-26",
    "presentation": "checklist"
  },
  {
    "id": "word-20",
    "slug": "uhod-za-mobilnoy-baney",
    "coverImage": "/images/articles/2026-11-26/uhod-za-mobilnoy-baney.webp",
    "coverAlt": "Поднятый настил открывает доступ к водосборной поверхности для уборки и сушки.",
    "title": "Уход за мобильной баней: как сохранить дерево и оборудование",
    "seoTitle": "Уход за мобильной баней: как сохранить дерево и оборудование | BANGER.SU",
    "metaDescription": "Просушка после парения, уход за полками, фасадом, печью и водоотведением.",
    "excerpt": "Просушка после парения, уход за полками, фасадом, печью и водоотведением.",
    "category": "Эксплуатация",
    "date": "",
    "readTime": 2,
    "content": "<p>Деревянная баня хорошо служит при регулярном уходе. Самая полезная привычка — не оставлять помещение влажным после отдыха. Правильная просушка, своевременный осмотр оборудования и обновление покрытия помогают предотвратить запах, плесень и преждевременный износ.</p>\n<h2 id=\"section-1\">После каждого посещения</h2>\n<p>Удалите воду с пола и полков, очистите доступный трап, при наличии поднимите съёмные щиты для просушки. Используйте предусмотренный режим вентиляции и остаточное тепло, соблюдая правила топки. Не оставляйте работающую печь без необходимого контроля. Мокрые полотенца и веники лучше вынести из бани. После высыхания осмотрите углы и участки под полками: там влага может задерживаться дольше всего.</p>\n<h2 id=\"section-3\">Деревянные поверхности и фасад</h2>\n<p>Убирайте загрязнения мягкими средствами, разрешёнными для конкретной породы древесины и режима эксплуатации. Не наносите на горячие поверхности случайные химические составы и бытовой лак. Если появились устойчивые тёмные пятна, выясните причину увлажнения до повторной обработки. Снаружи следите за состоянием покрытия, торцов досок, отливов и свесов. Периодичность обновления зависит от покрытия и воздействия погоды.</p>\n<h2 id=\"section-5\">Печь, дымоход и вода</h2>\n<p>Чистите и осматривайте оборудование по инструкции производителя и с учётом интенсивности использования. Проверяйте состояние камней, удаляйте разрушившиеся фрагменты на остывшей печи. Не допускайте накопления отложений в дымоходе; осмотр и чистку при необходимости поручайте специалисту. Перед длительным зимним простоем опорожняйте водяную систему в соответствии с инструкциями оборудования. Проверяйте доступные сливные элементы, уплотнения окон и дверей, работу заслонок.</p>\n<p>Если обнаружили дым в помещении, перегрев деревянных деталей, запах горелой изоляции или неисправность электрики, прекратите эксплуатацию до проверки. Уход должен помогать сохранить баню, а не скрывать признаки неисправности.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "После каждого посещения",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Деревянные поверхности и фасад",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Печь, дымоход и вода",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "otdelka-parnoy-i-polki",
      "prolivnoy-pol-v-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "image": "/images/articles/2026-11-26/uhod-za-mobilnoy-baney.webp",
    "imageAlt": "Поднятый настил открывает доступ к водосборной поверхности для уборки и сушки.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "imageCaption": "3D-визуализация. Поднятый настил открывает доступ к водосборной поверхности для уборки и сушки.",
    "updatedAt": "2026-11-26",
    "presentation": "reference"
  },
  {
    "id": "editorial-20261116-01",
    "slug": "pochemu-karkasnaya-banya",
    "title": "Как устроена каркасная баня BANGER: от производства до готового изделия",
    "seoTitle": "Как устроена каркасная баня BANGER: этапы производства | BANGER.SU",
    "metaDescription": "Этапы производства каркасной бани BANGER — от подготовки проекта и пиломатериалов до контроля готового модуля и доставки.",
    "excerpt": "Этапы производства каркасной бани BANGER — от подготовки проекта и пиломатериалов до контроля готового модуля и доставки.",
    "category": "Производство BANGER",
    "date": "2026-11-16",
    "readTime": 3,
    "coverImage": "/images/articles/2026-11-26/pochemu-karkasnaya-banya-production.webp",
    "coverAlt": "Каркас мобильной бани на этапе сборки в производственном помещении — 3D-визуализация",
    "image": "/images/articles/2026-11-26/pochemu-karkasnaya-banya-production.webp",
    "imageAlt": "Каркас мобильной бани на этапе сборки в производственном помещении — 3D-визуализация",
    "imageCaption": "Нейтральная 3D-визуализация условного этапа каркасного производства BANGER; не технический чертёж и не фотография конкретного заказа.",
    "imageWidth": 1672,
    "imageHeight": 941,
    "content": "<p>Каркасная баня BANGER — готовый модуль, который проходит путь от согласованного проекта до подготовки к доставке. Планировка, отделка, оборудование и инженерные решения зависят от выбранной модели и комплектации. Ниже описан общий порядок производства; он не заменяет чертежи и спецификацию конкретного заказа.</p>\n<h2 id=\"section-1\">1. Проект и подготовка пиломатериалов</h2>\n<p>До начала работ фиксируют размеры, планировку, расположение проёмов, отделку и выбранное оборудование. Пиломатериалы и детали готовят под согласованный проект. Производственный процесс включает этапы от распуска материала до чистовой отделки.</p>\n<h2 id=\"section-3\">2. Основание и нижняя обвязка</h2>\n<p>Основание модуля и нижнюю обвязку собирают по рабочему проекту. На этом этапе важно выдержать размеры и геометрию, от которых зависит дальнейшая сборка. Сечения, узлы соединений и другие конструктивные параметры определяются документацией конкретной модели.</p>\n<h2 id=\"section-5\">3. Сборка каркаса и перегородок</h2>\n<p>Каркас собирают с учётом выбранной планировки. Положение помещений, перегородок, дверных и оконных проёмов сверяют с проектом: самовольный перенос проёма или перегородки может потребовать пересмотра конструкции.</p>\n<h2 id=\"section-7\">4. Теплоизоляция стен, пола и потолка</h2>\n<p>В базовой спецификации BANGER предусмотрена минеральная вата ISOVER или URSA толщиной 100 мм для стен, пола и потолка. Состав конкретного заказа следует сверять с его спецификацией: дополнительные решения не являются автоматической частью каждой модели.</p>\n<h2 id=\"section-9\">5. Пароизоляция и защита от ветра и влаги</h2>\n<p>Пароизоляция со стороны тёплого помещения и ветровлагозащитный слой выполняют разные задачи. Их расположение и стыки определяются конструкцией узла. Для парной предусмотрена фольгированная пароизоляция; места соединений герметизируют материалами, соответствующими принятому узлу.</p>\n<h2 id=\"section-11\">6. Коммуникации и оборудование</h2>\n<p>Расположение освещения, электрики, водоснабжения и оборудования согласуют с планировкой и комплектацией. Точные трассы и точки подключения зависят от заказа, поэтому их нельзя переносить из одной модели в другую без проверки проекта.</p>\n<h2 id=\"section-13\">7. Внутренняя и наружная отделка</h2>\n<p>Материалы и цвета отделки фиксируют в согласованной комплектации. Для базовых моделей снаружи применяется имитация бруса; внутренняя отделка и материалы парной указываются в спецификации выбранного исполнения.</p>\n<h2 id=\"section-15\">8. Печь и дымоход</h2>\n<p>Печь располагается в парной, а топочная дверца выводится в соседнее помещение согласно планировке. Модель печи и схема дымохода согласуются для конкретного проекта с учётом документации производителя оборудования. Нельзя произвольно менять расположение печи или проходов после утверждения проекта.</p>\n<h2 id=\"section-17\">9. Контроль готовности</h2>\n<p>В ходе производства проверяют соответствие выполняемых работ согласованной модели и комплектации. Перед завершением заказа сопоставляют готовое изделие со спецификацией и осматривают отделку и установленное оборудование.</p>\n<h2 id=\"section-19\">10. Подготовка к доставке</h2>\n<p>Когда баня готова, заранее согласуют доставку и условия установки на участке: подъезд, место для техники и подготовленную площадку. Возможность разгрузки зависит от реальных условий объекта; их важно сообщить производителю до отправки.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "1. Проект и подготовка пиломатериалов",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "2. Основание и нижняя обвязка",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "3. Сборка каркаса и перегородок",
        "level": 2
      },
      {
        "id": "section-7",
        "title": "4. Теплоизоляция стен, пола и потолка",
        "level": 2
      },
      {
        "id": "section-9",
        "title": "5. Пароизоляция и защита от ветра и влаги",
        "level": 2
      },
      {
        "id": "section-11",
        "title": "6. Коммуникации и оборудование",
        "level": 2
      },
      {
        "id": "section-13",
        "title": "7. Внутренняя и наружная отделка",
        "level": 2
      },
      {
        "id": "section-15",
        "title": "8. Печь и дымоход",
        "level": 2
      },
      {
        "id": "section-17",
        "title": "9. Контроль готовности",
        "level": 2
      },
      {
        "id": "section-19",
        "title": "10. Подготовка к доставке",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "karkas-ili-brus-dlya-bani",
      "materialy-dlya-mobilnoy-bani",
      "dostavka-i-ustanovka-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "process"
  },
  {
    "id": "editorial-20261116-02",
    "slug": "uteplenie-isover-ursa-bani",
    "title": "Почему мы используем минеральную вату ISOVER или URSA",
    "seoTitle": "Почему мы используем минеральную вату ISOVER или URSA | BANGER.SU",
    "metaDescription": "Как работает волокнистый утеплитель и зачем ему защита от ветра и пара.",
    "excerpt": "Как работает волокнистый утеплитель и зачем ему защита от ветра и пара.",
    "category": "О технологии BANGER",
    "date": "2026-11-16",
    "readTime": 2,
    "coverImage": "/images/articles/2026-11-26/uteplenie-isover-ursa-bani.webp",
    "coverAlt": "Минеральная вата между стойками каркаса; базовая толщина в BANGER — 100 мм.",
    "image": "/images/articles/2026-11-26/uteplenie-isover-ursa-bani.webp",
    "imageAlt": "Минеральная вата между стойками каркаса; базовая толщина в BANGER — 100 мм.",
    "imageCaption": "3D-визуализация. Минеральная вата между стойками каркаса; базовая толщина в BANGER — 100 мм.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "content": "<p>Минеральная вата — один из материалов, подходящих для теплоизоляции деревянных каркасных конструкций. В стандартных мобильных банях BANGER используется ISOVER или URSA толщиной 100 мм в стенах, полу и потолке. Важно не только выбрать марку, но и обеспечить условия, при которых утеплитель будет работать как задумано.</p>\n<h2 id=\"section-1\">Как минеральная вата удерживает тепло</h2>\n<p>Волокнистый материал содержит множество мелких воздушных промежутков. Такая структура замедляет передачу тепла. Подходящие плиты или маты устанавливают между стойками и лагами так, чтобы они заполняли предусмотренный объём без сквозных щелей, чрезмерного сжатия и провисания. Конкретную серию выбирают по назначению, характеристикам и инструкции производителя. Не все изделия одного бренда имеют одинаковую теплопроводность и класс пожарной опасности.</p>\n<h2 id=\"section-3\">Почему важно закрыть утеплитель</h2>\n<p>При увлажнении теплоизоляционные свойства конструкции могут ухудшаться, а деревянные детали — дольше оставаться сырыми. Со стороны помещения требуется предусмотренный парозащитный слой; со стороны наружного воздуха — ветровлагозащита. В парной применяется фольгированная бумага с герметичной проклейкой стыков. Волокнистая теплоизоляция не заменяет эти материалы и не является гидроизоляцией пола. В зоне печи используют только те решения, которые подходят по температуре и противопожарным требованиям.</p>\n<h2 id=\"section-5\">Толщина и индивидуальные решения</h2>\n<p>Слой 100 мм является нашим стандартом, а не универсальной гарантией результата при любой погоде. Для длительного зимнего отопления или других специальных условий оценивают все ограждения и теплопотери. Для специальных условий состав, толщину и конструкцию утепления согласуют отдельно с учётом проекта.</p>\n<p>Хорошее утепление — это не просто упаковка известного бренда. Это плотное заполнение каркаса, правильная защита слоёв и аккуратное выполнение всех примыканий.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Как минеральная вата удерживает тепло",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Почему важно закрыть утеплитель",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Толщина и индивидуальные решения",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "uteplenie-mobilnoy-bani-dlya-zimy",
      "pirog-steny-mobilnoy-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "anatomy"
  },
  {
    "id": "editorial-20261116-03",
    "slug": "pochemu-ne-ispolzuem-epps-v-polu",
    "title": "Почему BANGER не использует ЭППС в стандартном деревянном полу",
    "seoTitle": "Почему BANGER не использует ЭППС в стандартном деревянном полу | BANGER.SU",
    "metaDescription": "Сравнение минеральной ваты и экструдированного пенополистирола без мифов о «дышащих» стенах.",
    "excerpt": "Сравнение минеральной ваты и экструдированного пенополистирола без мифов о «дышащих» стенах.",
    "category": "О технологии BANGER",
    "date": "2026-11-16",
    "readTime": 2,
    "coverImage": "/images/articles/2026-11-26/pochemu-ne-ispolzuem-epps-v-polu.webp",
    "coverAlt": "Волокнистый утеплитель в деревянном каркасе. Выбор теплоизоляции зависит от всей конструкции пола.",
    "image": "/images/articles/2026-11-26/pochemu-ne-ispolzuem-epps-v-polu.webp",
    "imageAlt": "Волокнистый утеплитель в деревянном каркасе. Выбор теплоизоляции зависит от всей конструкции пола.",
    "imageCaption": "3D-визуализация. Волокнистый утеплитель в деревянном каркасе. Выбор теплоизоляции зависит от всей конструкции пола.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "content": "<p>ЭППС — экструдированный пенополистирол. Это жёсткий теплоизоляционный материал с низким водопоглощением и хорошей стойкостью к сжатию. Он применяется, например, в специально рассчитанных полах под стяжкой и конструкциях, контактирующих с грунтом. Но свойства материала нужно оценивать применительно к конкретному перекрытию.</p>\n<h2 id=\"section-1\">Чем отличается деревянный пол мобильной бани</h2>\n<p>В стандартном полу BANGER теплоизоляция располагается в деревянной конструкции. Для неё предусмотрена минеральная вата ISOVER или URSA толщиной 100 мм. Волокнистый утеплитель хорошо подходит для заполнения пространства между лагами при правильном монтаже. В конструкции важны защитные мембраны, герметичность со стороны помещения и защита от продувания снизу. В мокрых зонах дополнительно предусматривают соответствующее водоотведение и гидроизоляцию.</p>\n<h2 id=\"section-3\">Что учитывать при применении ЭППС</h2>\n<p>У ЭППС сравнительно низкая паропроницаемость. Если влага попадает к деревянным лагам, возможность высыхания зависит от всего устройства пола, а не от одного утеплителя. Жёсткие плиты требуют точной подгонки и герметизации предусмотренных стыков. Также нужно учитывать допустимые температуры и пожарные характеристики. Например, для ПЕНОПЛЭКС КОМФОРТ производитель указывает диапазон эксплуатации от −70 до +75 °C и группу горючести Г4; эти сведения относятся к конкретному изделию, а не ко всем плитным материалам.</p>\n<h2 id=\"section-5\">Можно ли применять ЭППС в бане вообще</h2>\n<p>Да, при проектном обосновании и соблюдении требований изготовителя. Нельзя объявлять ЭППС всегда непригодным или обещать, что минеральная вата сама по себе исключит конденсат. Для мокрого пола, основания и печной зоны решение проверяют отдельно. В стандартном деревянном перекрытии наших бань используется минеральная вата, потому что она соответствует принятой конструкции. Главный принцип — сохранить древесину сухой, удержать тепло и обеспечить безопасный режим эксплуатации.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Чем отличается деревянный пол мобильной бани",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Что учитывать при применении ЭППС",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Можно ли применять ЭППС в бане вообще",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "uteplenie-mobilnoy-bani-dlya-zimy",
      "pol-i-sliv-v-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "comparison"
  },
  {
    "id": "editorial-20261116-04",
    "slug": "prolivnoy-pol-v-bane",
    "title": "Как устроен проливной пол в парной и помывочной",
    "seoTitle": "Как устроен проливной пол в парной и помывочной | BANGER.SU",
    "metaDescription": "Подъёмные щиты, гидроизоляция, уклон к трапу и сухой затвор.",
    "excerpt": "Подъёмные щиты, гидроизоляция, уклон к трапу и сухой затвор.",
    "category": "О технологии BANGER",
    "date": "2026-11-16",
    "readTime": 2,
    "coverImage": "/images/articles/2026-11-26/prolivnoy-pol-v-bane.webp",
    "coverAlt": "Подъёмные деревянные щиты над водосборной поверхностью с трапом. Тип затвора определяет проект.",
    "image": "/images/articles/2026-11-26/prolivnoy-pol-v-bane.webp",
    "imageAlt": "Подъёмные деревянные щиты над водосборной поверхностью с трапом. Тип затвора определяет проект.",
    "imageCaption": "3D-визуализация. Подъёмные деревянные щиты над водосборной поверхностью с трапом. Тип затвора определяет проект.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "content": "<p>Проливной пол удобен там, где во время банных процедур на настил попадает вода. В отличие от обычного сухого пола, здесь деревянная поверхность и водоотведение выполняют разные функции. Правильное решение позволяет ходить по дереву, а воде — уходить в предусмотренный слив.</p>\n<h2 id=\"section-1\">Как устроен настил</h2>\n<p>Деревянные доски собираются с предусмотренными промежутками, через которые вода проходит вниз. Настил может выполняться в виде отдельных съёмных или подъёмных щитов. В реализованной клиентской бане «Скандинавия» 6 × 2,6 м использованы именно подъёмные щиты из лиственницы. Их можно поднять для уборки и просушки поверхности под ними. Лиственница хорошо подходит для такого исполнения при грамотном уходе, но она не является водонепроницаемым материалом и не освобождает от просушки.</p>\n<h2 id=\"section-3\">Что находится под щитами</h2>\n<p>Под настилом предусмотрена водосборная поверхность с гидроизоляцией и уклоном к трапу. Стыки и проход трапа должны быть герметичными. Вода уходит в согласованную систему водоотведения, не попадая на утеплитель или скрытые деревянные элементы. В указанном индивидуальном проекте установлен сухой затвор, препятствующий проникновению запаха при отсутствии воды в затворе. Устройство затвора зависит от конкретного изделия. На иллюстрации показан принцип, а не точная спецификация всех моделей.</p>\n<h2 id=\"section-5\">Чем удобно подъёмное исполнение</h2>\n<p>После использования можно поднять щиты, убрать загрязнения, промыть доступную водосборную поверхность и дать дереву просохнуть. Важно не оставлять воду в холодных трубах зимой и регулярно чистить трап. Щиты должны быть устойчивыми, иметь безопасные кромки и не создавать опасных перепадов высоты.</p>\n<p>Проливной пол — отдельное исполнение. При заказе согласуйте материал настила, его конструкцию, состав гидроизоляции, слив и отвод стоков. Не считайте подъёмные щиты из лиственницы обязательной частью стандартной комплектации.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Как устроен настил",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Что находится под щитами",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Чем удобно подъёмное исполнение",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "pol-i-sliv-v-bane",
      "uhod-za-mobilnoy-baney"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "anatomy"
  },
  {
    "id": "editorial-20261116-05",
    "slug": "otkrytaya-ili-zakrytaya-kamenka",
    "title": "Открытая и закрытая каменка: в чём разница",
    "seoTitle": "Открытая и закрытая каменка: в чём разница | BANGER.SU",
    "metaDescription": "Как расположение камней влияет на характер парения и выбор печи.",
    "excerpt": "Как расположение камней влияет на характер парения и выбор печи.",
    "category": "Печи и пар",
    "date": "2026-11-16",
    "readTime": 2,
    "coverImage": "/images/articles/2026-11-26/otkrytaya-ili-zakrytaya-kamenka.webp",
    "coverAlt": "Сравнение верхних частей открытой и закрытой каменок; устройство конкретной печи уточняют по паспорту.",
    "image": "/images/articles/2026-11-26/otkrytaya-ili-zakrytaya-kamenka.webp",
    "imageAlt": "Сравнение верхних частей открытой и закрытой каменок; устройство конкретной печи уточняют по паспорту.",
    "imageCaption": "3D-визуализация. Сравнение верхних частей открытой и закрытой каменок; устройство конкретной печи уточняют по паспорту.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "content": "<p>Устройство каменки влияет на то, как нагреваются камни, воздух и как образуется пар при подаче воды. Открытая и закрытая каменки дают разные возможности управления режимом, но качество парения зависит от всей конструкции печи и правильной эксплуатации.</p>\n<h2 id=\"section-1\">Открытая каменка</h2>\n<p>Камни располагаются в доступной чаше или сетке и контактируют с воздухом помещения. Воду обычно подают на доступные нагретые камни в разрешённом производителем количестве. Поверхность отдаёт тепло воздуху; степень конвекции зависит от модели, массы загрузки и кожуха печи. Открытая каменка удобна тем, что камни видны и к ним проще получить доступ для обслуживания после полного остывания.</p>\n<h2 id=\"section-3\">Закрытая каменка</h2>\n<p>Камни находятся во внутренней камере, конструкция которой ограничивает их непосредственный контакт с воздухом парной. Воду подают через предусмотренное отверстие, дверцу или устройство распределения. В некоторых печах закрытая каменка позволяет нагреть камни сильнее при умеренной температуре воздуха. Это может быть удобно для любителей режима русской бани. Однако само слово «закрытая» не гарантирует определённую температуру камней или качество пара. Есть комбинированные печи, в которых используются обе зоны.</p>\n<h2 id=\"section-5\">Что выбрать для своей бани</h2>\n<p>Ориентируйтесь на объём парной, остекление, допустимую массу печи и камней, способ топки и желаемый режим. Если хочется быстро прогревать небольшую парную, одна модель может оказаться удобнее; если важна накопленная энергия камней и управляемая подача пара — другая. Сравнивайте паспорта конкретных моделей. Воду подавайте только в предусмотренную зону, соблюдайте ограничения производителя и не наклоняйтесь над местом выхода горячего пара.</p>\n<p>Нет универсального победителя: важно, чтобы печь подходила именно к вашей парной и была правильно установлена.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Открытая каменка",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Закрытая каменка",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Что выбрать для своей бани",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "kak-vybrat-pech-dlya-mobilnoy-bani",
      "kakie-kamni-luchshe-dlya-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "comparison"
  },
  {
    "id": "editorial-20261116-06",
    "slug": "kakie-kamni-luchshe-dlya-bani",
    "title": "Какие камни выбрать для банной печи",
    "seoTitle": "Какие камни выбрать для банной печи | BANGER.SU",
    "metaDescription": "Популярные породы, размер загрузки, термостойкость и обслуживание.",
    "excerpt": "Популярные породы, размер загрузки, термостойкость и обслуживание.",
    "category": "Печи и пар",
    "date": "2026-11-16",
    "readTime": 2,
    "coverImage": "/images/articles/2026-11-26/kakie-kamni-luchshe-dlya-bani.webp",
    "coverAlt": "Фактура и форма камней для каменки; пригодность подтверждают паспортом материала.",
    "image": "/images/articles/2026-11-26/kakie-kamni-luchshe-dlya-bani.webp",
    "imageAlt": "Фактура и форма камней для каменки; пригодность подтверждают паспортом материала.",
    "imageCaption": "3D-визуализация. Фактура и форма камней для каменки; пригодность подтверждают паспортом материала.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "content": "<p>Камни в печи накапливают тепло и участвуют в образовании пара. Их нельзя выбирать только по цвету или обещаниям продавца о лечебных свойствах. Гораздо важнее совместимость с конкретной печью, подходящий размер, устойчивость к перепадам температуры и безопасная эксплуатация.</p>\n<h2 id=\"section-1\">Популярные породы</h2>\n<p>Габбро-диабаз часто выбирают как доступный вариант камней для банных печей. Жадеит ценят за плотность и красивый зеленоватый оттенок; талькохлорит — за способность аккумулировать тепло; кварцит бывает выразительным декоративным материалом. Свойства и долговечность зависят от конкретной партии и структуры камня. Не все изделия из этих пород подходят для любой каменки. Не используйте случайные камни с дороги, строительный щебень или неизвестные минералы: они могут разрушаться при нагреве.</p>\n<h2 id=\"section-3\">Размер и укладка</h2>\n<p>Производитель печи указывает допустимые размеры и массу камней. Слишком мелкие фрагменты могут мешать предусмотренному движению воздуха, а слишком крупные — не помещаться в камере. Перед укладкой подготовьте камни по инструкции, в том числе промойте и удалите повреждённые экземпляры, если это предусмотрено. Не превышайте допустимую загрузку и не перекрывайте элементы печи вопреки её паспорту. Для электрических и дровяных каменок правила укладки могут различаться.</p>\n<h2 id=\"section-5\">Когда менять камни</h2>\n<p>После полного остывания периодически осматривайте загрузку, удаляйте крошку и расколовшиеся камни, проверяйте состояние каменки. Частота осмотра зависит от числа топок и рекомендаций изготовителя. Если камни разрушаются быстро, проверьте правильность породы, размера, режима нагрева и подачи воды. Не обещайте себе особых медицинских эффектов от камней: надёжное и комфортное парение определяется прежде всего подходящей печью, её состоянием и правильной эксплуатацией.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Популярные породы",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Размер и укладка",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Когда менять камни",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "otkrytaya-ili-zakrytaya-kamenka",
      "parovaya-pushka-v-bane"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "reference"
  },
  {
    "id": "editorial-20261116-07",
    "slug": "parovaya-pushka-v-bane",
    "title": "Паровая пушка в бане: что это и для чего нужна",
    "seoTitle": "Паровая пушка в бане: что это и для чего нужна | BANGER.SU",
    "metaDescription": "Как устройство подаёт воду к нагретой зоне и почему важно учитывать совместимость с печью.",
    "excerpt": "Как устройство подаёт воду к нагретой зоне и почему важно учитывать совместимость с печью.",
    "category": "Печи и пар",
    "date": "2026-11-16",
    "readTime": 2,
    "coverImage": "/images/articles/2026-11-26/parovaya-pushka-v-bane.webp",
    "coverAlt": "Иллюстрация принципа подачи воды к нагретым камням; не устройство конкретной паровой пушки.",
    "image": "/images/articles/2026-11-26/parovaya-pushka-v-bane.webp",
    "imageAlt": "Иллюстрация принципа подачи воды к нагретым камням; не устройство конкретной паровой пушки.",
    "imageCaption": "3D-визуализация. Иллюстрация принципа подачи воды к нагретым камням; не устройство конкретной паровой пушки.",
    "imageWidth": 1600,
    "imageHeight": 900,
    "content": "<p>Когда воду подают на камни, часть тепла расходуется на нагрев и испарение. Если вода попадает на недостаточно нагретую поверхность, результат может отличаться от ожидаемого. Паровая пушка — одно из решений, которое позволяет направлять воду в предусмотренную нагретую область каменки.</p>\n<h2 id=\"section-1\">Как работает устройство</h2>\n<p>В зависимости от модели вода поступает через воронку, канал или другую систему подачи и направляется к нагретым камням либо в специальную парообразующую камеру. Пар выходит через предусмотренный изготовителем путь. Конструкция и принцип подачи отличаются у разных производителей. Паровая пушка не обязательно является отдельной металлической трубкой: встречаются встроенные заводские системы. Это не то же самое, что внешний электрический парогенератор.</p>\n<h2 id=\"section-3\">Когда она может быть полезна</h2>\n<p>Устройство позволяет подавать воду туда, где температура выше, чем на доступном верхнем слое камней, если это предусмотрено конструкцией. Это может помочь получать более управляемые порции пара. Но результат зависит от прогрева печи, количества воды, объёма парной и вентиляции. Само наличие пушки не означает, что пар всегда будет лёгким и комфортным. Слишком большая порция воды способна охладить камни или привести к выбросу горячего пара.</p>\n<h2 id=\"section-5\">Как пользоваться безопасно</h2>\n<p>Выбирайте совместимое с печью устройство и следуйте инструкции производителя. Не устанавливайте самодельные герметичные ёмкости и не изменяйте пути выхода пара. Не наклоняйтесь над воронкой и выходным отверстием; подавайте воду только в разрешённом объёме и способом, указанным в документации. Осмотр и чистку выполняйте после полного остывания. В BANGER паровая пушка доступна как дополнительная опция; совместимость с выбранной печью и условия установки уточняются при заказе.</p>",
    "toc": [
      {
        "id": "section-1",
        "title": "Как работает устройство",
        "level": 2
      },
      {
        "id": "section-3",
        "title": "Когда она может быть полезна",
        "level": 2
      },
      {
        "id": "section-5",
        "title": "Как пользоваться безопасно",
        "level": 2
      }
    ],
    "relatedSlugs": [
      "kak-vybrat-pech-dlya-mobilnoy-bani",
      "kakie-kamni-luchshe-dlya-bani"
    ],
    "resourceLinks": [
      {
        "href": "/katalog/bani",
        "label": "Подобрать баню и комплектацию"
      },
      {
        "href": "/kontakty#zayavka",
        "label": "Получить консультацию"
      },
      {
        "href": "/nashi-raboty",
        "label": "Посмотреть реализованные проекты"
      }
    ],
    "updatedAt": "2026-11-26",
    "presentation": "reference"
  }
]



export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)
}
export function getSaunasByPopularity(): Sauna[] { return saunas.filter(s => s.isPublished !== false && s.isPopular) }
export function getHomesByPopularity(): Home[] { return homes.filter(h => h.isPublished !== false && h.isPopular) }
export function getSaunaCount(): number { return saunas.filter(s => s.isPublished !== false).length }
export function getHomeCount(): number { return homes.filter(h => h.isPublished !== false).length }

// BEGIN OWNER APPROVED PUBLICATION 2026-11-18
// Public selections are derived centrally; archived model routes/data remain available.
export const publishedSaunas = saunas.filter(model => model.isPublished !== false)
export const publishedHomes = homes.filter(model => model.isPublished !== false)
// END OWNER APPROVED PUBLICATION 2026-11-18
