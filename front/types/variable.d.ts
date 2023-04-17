/**
 * The internal imports
 */
import type { FC } from 'react'
import type { LabelTranslations } from './common'

export type Variable = LabelTranslations & DescriptionTranslations & {
  id: number
  isNeonat: boolean
  isMandatory: boolean
  answerType: {
    value: string
  },
  type: string
}

export type InfoComponent = FC<{ variable: Variable }>
