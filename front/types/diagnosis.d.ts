/**
 * The internal imports
 */
import type { LabelTranslations, DescriptionTranslations } from './common'

export type Diagnosis = LabelTranslations &
  DescriptionTranslations & {
    id: number
    levelOfUrgency: number
  }
