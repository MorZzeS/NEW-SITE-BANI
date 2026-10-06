export function modelCountWord(count: number): string {
  const lastTwo = count % 100
  if (lastTwo >= 11 && lastTwo <= 14) return 'моделей'
  const last = count % 10
  return last === 1 ? 'модель' : last >= 2 && last <= 4 ? 'модели' : 'моделей'
}
