/**
 * The internal import
 */
import type { QuestionsSequenceInput } from './graphql'

export type QuestionSequencesComponent = React.FC<
  ProjectId & { questionsSequenceId?: Scalars['ID'] }
>

export type QuestionSequencesInputs = Omit<
  QuestionsSequenceInput,
  'id' | 'labelTranslations' | 'descriptionTranslations' | 'projectId'
> & {
  label?: string
  description?: string
}
