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
export const bathVideos: BathVideo[] = []

export const bathVideoAction = {
  title: 'Смотреть наши бани',
  caption: 'короткие видео изнутри',
}
