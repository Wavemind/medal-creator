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
  cutOffStart: number
  cutOffEnd: number
  cutOffValueType: string
  updatedAt: Date
}

export type DecisionTreeInputs = Partial<LabelTranslations> & {
  id: number
  algorithmId?: number
  label?: string
  nodeId: number
  cutOffStart?: number | null
  cutOffEnd?: number | null
  cutOffValueType: string
}
