import { LabelTranslations } from './common'

export type NodeData = LabelTranslations & {
  id: string
  type: string
  category: string
  answers?: Pick<AvailableNode, 'diagramAnswers'>
}

export type AvailableNode = LabelTranslations & {
  id: string
  category: string
  diagramAnswers:
    | ({
        id: string
      } & LabelTranslations[])
    | []
}
