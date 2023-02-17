// TODO : Generalize the translations like we do in the backend with HSTORE

import type { Algorithm } from './algorithm'
import type { LabelTranslations } from './common'

export type DecisionTree = LabelTranslations &
  Algorithm & {
    id: number
    node: LabelTranslations
    updatedAt: number
  }
