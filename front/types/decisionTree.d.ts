/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { LabelTranslations, ProjectId, AlgorithmId } from './common'

export type AlgorithmIdAndProjectId = ProjectId & AlgorithmId

export type DecisionTreeInputs = Partial<LabelTranslations> & {
  algorithmId?: number
  label?: string
  nodeId: number
  cutOffStart?: number | null
  cutOffEnd?: number | null
  cutOffValueType: string
}

export type DecisionTreeFormComponent = FC<
  AlgorithmIdAndProjectId & {
    decisionTreeId?: number
    nextStep?: () => void
    setDecisionTreeId?: React.Dispatch<React.SetStateAction<number | undefined>>
  }
>

export type DecisionTreeStepperComponent = FC<AlgorithmIdAndProjectId>

export type DecisionTreeSummaryComponent = FC<
  AlgorithmIdAndProjectId & {
    decisionTreeId: number
    prevStep: () => void
    setDiagnosisId: React.Dispatch<React.SetStateAction<number | undefined>>
  }
>
