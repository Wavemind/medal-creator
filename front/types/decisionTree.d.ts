// TODO : Generalize the translations like we do in the backend with HSTORE

import { LabelTranslations } from "./common"

// TODO : Replace algorithm by algorithm type when it is created
export type DecisionTree = LabelTranslations & {
  id: number
  node: LabelTranslations
  algorithm: {
    name: string
  }
  updatedAt: number
}
