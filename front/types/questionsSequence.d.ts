import type { FC } from 'react'

/**
 * The internal import
 */
import type { QuestionsSequenceInput, Scalars } from './graphql'
import type { UpdatableNodeValues } from './node'
import type { ProjectId } from './common'

export type QuestionsSequenceComponent = FC<
  ProjectId & {
    questionsSequenceId?: Scalars['ID']
    callback?: (data: UpdatableNodeValues) => void
  }
>

export type QuestionsSequenceInputs = Omit<
  QuestionsSequenceInput,
  | 'id'
  | 'labelTranslations'
  | 'descriptionTranslations'
  | 'projectId'
  | 'isNeonat'
> & {
  complaintCategoryOptions?: Array<{ label: string; value: string }>
  label?: string
  description?: string
}
