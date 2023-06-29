/**
 * The internal imports
 */
import { LabelTranslations } from './common'

export type AvailableNode = LabelTranslations & {
  id: string
  category: string
  diagramAnswers: DiagramAnswers[] | []
}

export type DiagramAnswers = LabelTranslations & {
  id: string
}
