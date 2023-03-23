/**
 * The external imports
 */
import type { FC } from 'react'
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import type { Algorithm } from './algorithm'
import type { LabelTranslations } from './common'
import type { Node } from './node'

export type DecisionTree = LabelTranslations & {
  id: number
  node: Node
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

export type DecisionTreeFormProps = {
  projectId: number
  algorithmId: number
  decisionTreeId?: number
  nextStep?: () => void
  setDecisionTreeId?: React.Dispatch<React.SetStateAction<number | undefined>>
}

export type DecisionTreeSteps = {
  label: DefaultTFuncReturn
  content: JSX.Element
}

export type DecisionTreeStepperProps = FC<{
  algorithmId: number
  projectId: number
}>

export type DecisionTreeSummaryProps = FC<{
  algorithmId: number
  projectId: number
  decisionTreeId: number
  prevStep: () => void
  setDiagnosisId: React.Dispatch<React.SetStateAction<number | undefined>>
}>
