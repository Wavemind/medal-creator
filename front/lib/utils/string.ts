/**
 * The internal imports
 */
import type { Hstore } from '@/types'

export const camelize = (text: string): string => {
  return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ''
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

export const extractTranslation = (
  translations: Omit<Hstore, 'id'> | undefined | null,
  language = 'en'
): string => {
  if (translations) {
    return translations[language as keyof typeof translations] || ''
  }
  return ''
}
