/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type {
  LabelTranslations,
  DescriptionTranslations,
  DiagnosisId,
  ProjectId,
} from './common'

export type DiagnosisQuery = Partial<LabelTranslations> &
  Partial<DescriptionTranslations> & {
    levelOfUrgency: number
    decisionTreeId: number
    filesToAdd: File[]
    existingFilesToRemove?: number[]
  }

export type DiagnosisInputs = {
  label?: string
  description?: string
  decisionTreeId: number
  levelOfUrgency: number
}

export type DiagnosisDetailComponent = FC<DiagnosisId>

export type DiagnosisFormComponent = FC<
  ProjectId & {
    decisionTreeId?: number
    diagnosisId?: number
    setDiagnosisId?: React.Dispatch<React.SetStateAction<number | undefined>>
    nextStep?: () => void
  }
>
