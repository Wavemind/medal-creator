// TODO : Generalize the translations like we do in the backend with HSTORE

import type { Algorithm } from './algorithm'
import type { LabelTranslations } from './common'
import type { Node } from './node'

export type DecisionTree = LabelTranslations & {
  id: number
  node: Node
  updatedAt: number
  algorithm: Algorithm
  cutOffStart: number
  cutOffEnd: number
  cutOffValueType: string
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
