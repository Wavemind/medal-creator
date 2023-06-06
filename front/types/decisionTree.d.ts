/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { LabelTranslations, ProjectId, AlgorithmId } from './common'
import { StringIterator } from 'lodash'

export type AlgorithmIdAndProjectId = ProjectId & AlgorithmId

export type DecisionTreeInputs = Partial<LabelTranslations> & AlgorithmId & {
  label?: string
  nodeId: string
  cutOffStart?: number | null
  cutOffEnd?: number | null
  cutOffValueType: string
}

export type DecisionTreeFormComponent = FC<
  AlgorithmIdAndProjectId & {
    decisionTreeId?: string
    nextStep?: () => void
    setDecisionTreeId?: React.Dispatch<React.SetStateAction<string | undefined>>
  }
>

export type DecisionTreeStepperComponent = FC<AlgorithmIdAndProjectId>

export type DecisionTreeSummaryComponent = FC<
  AlgorithmIdAndProjectId & {
    decisionTreeId: StringIterator
    prevStep: () => void
    setDiagnosisId: React.Dispatch<React.SetStateAction<string | undefined>>
  }
>
