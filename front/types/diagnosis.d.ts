/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type {
  DecisionTreeId,
  DiagnosisId,
  ProjectId,
  UpdatableNodeValues,
} from './common'
import type { DiagnosisInput, Scalars } from './graphql'

export type DiagnosisInputs = Omit<
  DiagnosisInput,
  | 'id'
  | 'labelTranslations'
  | 'descriptionTranslations'
  | 'decisionTreeId'
  | 'projectId'
  | 'isNeonat'
> & {
  label?: string
  description?: string
}

export type DiagnosisDetailComponent = FC<DiagnosisId>

export type DiagnosisFormComponent = FC<
  ProjectId &
    Partial<DecisionTreeId> &
    Partial<DiagnosisId> & {
      setDiagnosisId?: React.Dispatch<
        React.SetStateAction<Scalars['ID'] | undefined>
      >
      nextStep?: () => void
      callback?: (data: UpdatableNodeValues) => void
    }
>
