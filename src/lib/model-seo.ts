interface ModelSeoSource {
  name: string
  size: string
  subtitle: string
  description: string
}

export function getModelSeoDescription(model: ModelSeoSource, kind: 'sauna' | 'home'): string {
  const size = model.size.replace(/\s*\+\s*крыльцо\s*$/u, ' с крыльцом')
  const identity = `${kind === 'sauna' ? 'Мобильная баня' : 'Дом'} «${model.name}» размером ${size}.`

  // Home copy currently mentions saunas; do not carry those claims into home metadata.
  if (kind === 'home') return identity

  const sentences = [identity]
  const seen = new Set<string>()
  for (const text of [model.subtitle, model.description]) {
    for (const part of text.replace(/\s+/gu, ' ').trim().split(/[.!?]+(?:\s+|$)/u)) {
      const sentence = part.trim()
      const key = sentence.toLocaleLowerCase('ru-RU')
      if (!sentence || seen.has(key)) continue
      seen.add(key)
      sentences.push(`${sentence}.`)
    }
  }
  return sentences.join(' ')
}
