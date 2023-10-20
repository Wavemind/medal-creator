/**
 * The external import
 */
import type { FC } from 'react'

/**
 * The internal import
 */
import type { QuestionsSequenceInput, Scalars } from './graphql'
import type { UpdatableNodeValues } from './node'

export type QuestionsSequenceComponent = FC<{
  questionsSequenceId?: Scalars['ID']
  callback?: (data: UpdatableNodeValues) => void
}>

export type QuestionsSequenceInputs = Omit<
  QuestionsSequenceInput,
  'id' | 'labelTranslations' | 'descriptionTranslations' | 'projectId'
> & {
  complaintCategoryOptions?: Array<{ label: string; value: string }>
  label?: string
  description?: string
}
