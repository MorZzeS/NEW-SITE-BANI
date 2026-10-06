export type BathVideo = {
  id: string
  title: string
  src: string
  poster: string
  duration?: string
  order: number
}

// Approved source folder: ../Видео для сайта (workspace root).
// Add only optimized owner footage and its WebP poster; no sample videos.
export const bathVideos: BathVideo[] = [
  { id: 'banya-01', title: 'Барн Премиум', src: '/NEW-SITE-BANI/videos/baths/banya-01.mp4', poster: '/NEW-SITE-BANI/videos/baths/banya-01-poster.webp', duration: '4:16', order: 1 },
  { id: 'banya-02', title: 'Скандинавия Стандарт 7 м', src: '/NEW-SITE-BANI/videos/baths/banya-02.mp4', poster: '/NEW-SITE-BANI/videos/baths/banya-02-poster.webp', duration: '2:07', order: 2 },
]

export const bathVideoAction = {
  title: 'Смотреть наши бани',
  caption: 'короткие видео изнутри',
}
