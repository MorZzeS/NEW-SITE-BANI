import { ExternalLink, Factory, MapPin } from 'lucide-react'
import locations from '@/data/company-locations.json'
import { YandexMapEmbed } from '@/components/integrations/YandexMapEmbed'
import { YandexReviewsWidget } from '@/components/integrations/YandexReviewsWidget'
import styles from './CompanyLocations.module.css'

export function CompanyLocations() {
  return <section id="company-locations" className={`${styles.section} site-anchor`} aria-labelledby="company-locations-title">
    <div className={styles.heading}>
      <p className="section-tag">Знакомство с производством</p>
      <h2 id="company-locations-title">Две площадки в Раменском</h2>
      <p>Выберите, куда вам удобнее приехать. Время посещения согласуем заранее.</p>
    </div>
    <div className={styles.cards}>
      {locations.locations.map((location, index) => {
        const Icon = index === 0 ? Factory : MapPin
        const route = `https://yandex.ru/maps/?rtext=~${location.latitude}%2C${location.longitude}&rtt=auto`
        return <article className={styles.card} key={location.id} data-location={location.id}>
          <div className={styles.cardTitle}><Icon size={21} aria-hidden="true" /><h3>{location.title}</h3></div>
          <p className={styles.address}>{location.address}</p>
          <p>{location.description}</p>
          <p className={styles.directions}>{location.directions}</p>
          <a href={route} target="_blank" rel="noopener noreferrer" aria-label={`Построить маршрут: ${location.title}, ${location.address}`}>Маршрут {index === 0 ? 'на производство' : 'на выставку'}<ExternalLink size={15} aria-hidden="true" /></a>
        </article>
      })}
    </div>
    <div className={styles.integrations}>
      <YandexMapEmbed embedUrl={locations.mapEmbedUrl} mapUrl={locations.mapUrl} title="Производство и выставка на карте" className={styles.map} />
      <YandexReviewsWidget
        embedUrl={`https://yandex.ru/maps-reviews-widget/${locations.businessId}?comments`}
        businessUrl={locations.reviewsUrl}
        description="Отзывы из карточки «Мобильные Бани Герасимов» на Яндексе. Порядок показа определяет Яндекс."
        className={styles.reviews}
      />
    </div>
  </section>
}
