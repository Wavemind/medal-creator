/**
 * The internal import
 */
import type { QuestionsSequenceInput } from './graphql'

export type QuestionsSequenceComponent = React.FC<
  ProjectId & { questionsSequenceId?: Scalars['ID'] }
>

export type QuestionsSequenceInputs = Omit<
  QuestionsSequenceInput,
  'id' | 'labelTranslations' | 'descriptionTranslations' | 'projectId'
> & {
  complaintCategoryOptions?: Array<{ label: string; value: string }>
  label?: string
  description?: string
}
