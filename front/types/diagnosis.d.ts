/**
 * The external imports
 */
import { FC } from 'react'

/**
 * The internal imports
 */
import type { LabelTranslations, DescriptionTranslations } from './common'
import { MediaType } from './node'

export type Diagnosis = LabelTranslations &
  DescriptionTranslations & {
    id: number
    levelOfUrgency: number
    files: MediaType[]
  }

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

export type DiagnosisFormProps = FC<{
  projectId: number
  decisionTreeId?: number
  diagnosisId?: number
  setDiagnosisId?: React.Dispatch<React.SetStateAction<number | undefined>>
  nextStep?: () => void
}>
