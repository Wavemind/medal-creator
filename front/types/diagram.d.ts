/**
 * The internal imports
 */
import { LabelTranslations } from './common'

export type AvailableNode = LabelTranslations & {
  id: string
  isNeonat: boolean
  category: string
  diagramAnswers: DiagramAnswers[] | []
}

export type DiagramAnswers = LabelTranslations & {
  id: string
}
