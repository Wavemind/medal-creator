/**
 * The internal imports
 */
import type { FC } from 'react'
import type { LabelTranslations, DescriptionTranslations } from './common'

export type Variable = LabelTranslations &
  DescriptionTranslations & {
    id: number
    isNeonat: boolean
    isMandatory: boolean
    answerType: {
      value: string
    }
    type: string
    dependenciesByAlgorithm: Array<{
      title: string
      dependencies: Array<{ label: string; id: number; type: string }>
    }>
  }

export type InfoComponent = FC<{ variable: Variable }>
