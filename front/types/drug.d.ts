/**
 * The internal imports
 */
import type { LabelTranslations } from './common'

export type Drug = LabelTranslations & {
  id: number
  isNeonat: boolean
  isAntibiotic: boolean
  isAntiMalarial: boolean
}
