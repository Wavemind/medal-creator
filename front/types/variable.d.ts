/**
 * The internal imports
 */
import type { LabelTranslations } from './common'

export type Variable = LabelTranslations & {
  id: number
  isNeonat: boolean
  answerType: {
    value: string
  },
  type: string
}
