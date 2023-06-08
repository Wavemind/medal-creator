/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { ProjectId, AlgorithmId, DecisionTreeId } from './common'
import { DecisionTreeInput, Scalars } from './graphql'

export type DecisionTreeInputs = Omit<
  DecisionTreeInput,
  'labelTranslations' | 'id' | 'algorithmId'
> & {
  label?: string
}

export type DecisionTreeFormComponent = FC<
  ProjectId &
    AlgorithmId &
    Partial<DecisionTreeId> & {
      nextStep?: () => void
      setDecisionTreeId?: React.Dispatch<
        React.SetStateAction<Scalars['ID'] | undefined>
      >
    }
>

export type DecisionTreeStepperComponent = FC<ProjectId & AlgorithmId>

export type DecisionTreeSummaryComponent = FC<
  ProjectId &
    AlgorithmId &
    DecisionTreeId & {
      prevStep: () => void
      setDiagnosisId: React.Dispatch<
        React.SetStateAction<Scalars['ID'] | undefined>
      >
    }
>
