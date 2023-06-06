/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { DiagnosisId, ProjectId } from './common'

export type DiagnosisInputs = {
  label?: string
  description?: string
  decisionTreeId: string
  levelOfUrgency: number
}

export type DiagnosisDetailComponent = FC<DiagnosisId>

export type DiagnosisFormComponent = FC<
  ProjectId & {
    decisionTreeId?: string
    diagnosisId?: string
    setDiagnosisId?: React.Dispatch<React.SetStateAction<string | undefined>>
    nextStep?: () => void
  }
>
