/**
 * The internal imports
 */
import type { LabelTranslations, DescriptionTranslations } from './common'

export type Diagnosis = LabelTranslations &
  DescriptionTranslations & {
    id: number
    levelOfUrgency: number
  }

export type DiagnosisQuery = Partial<LabelTranslations> &
  Partial<DescriptionTranslations> & {
    levelOfUrgency: number
    decisionTreeId: number
    files: File[]
  }

export type DiagnosisInputs = {
  label?: string
  description?: string
  decisionTreeId: number
  levelOfUrgency: number
}
