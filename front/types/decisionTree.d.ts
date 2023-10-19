/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { AlgorithmId, DecisionTreeId } from './common'
import { DecisionTreeInput, Scalars } from './graphql'

export type DecisionTreeInputs = Omit<
  DecisionTreeInput,
  'id' | 'labelTranslations' | 'algorithmId'
> & {
  label?: string
}

export type DecisionTreeFormComponent = FC<
  AlgorithmId &
    Partial<DecisionTreeId> & {
      nextStep?: () => void
      setDecisionTreeId?: React.Dispatch<
        React.SetStateAction<Scalars['ID'] | undefined>
      >
    }
>

export type DecisionTreeStepperComponent = FC<AlgorithmId>

export type DecisionTreeSummaryComponent = FC<
  AlgorithmId &
    DecisionTreeId & {
      prevStep: () => void
      setDiagnosisId: React.Dispatch<
        React.SetStateAction<Scalars['ID'] | undefined>
      >
    }
>
