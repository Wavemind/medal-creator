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

/**
 * Split by [], {ToDay}, {ToMonth}, {ToDay()} and {ToMonth()}
 * @param formula string
 * @returns string split
 */
export const extractFormula = (formula: string): Array<string> =>
  formula.split(
    /(\[[^[\]]+\]|{ToDay}|{ToMonth}|{ToDay\([0-9]+\)}|{ToMonth\([0-9]+\)})/g
  )
