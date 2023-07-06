/**
 * The external imports
 */
import type { FC } from 'react'
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import type { Algorithm } from './algorithm'
import type { LabelTranslations, ProjectId, AlgorithmId } from './common'
import type { Node } from './node'

export type AlgorithmIdAndProjectId = ProjectId & AlgorithmId

export type DecisionTree = LabelTranslations & {
  id: number
  node: LabelTranslations & {
    id: number
  }
  algorithm: Algorithm
  cutOffStart: number | null
  cutOffEnd: number | null
  cutOffValueType: string
  updatedAt: Date
}

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
