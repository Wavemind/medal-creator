/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetQuestionsSequencesQuery,
  api as generatedQuestionSequencesApi,
  CreateQuestionsSequenceMutation,
} from '../generated/questionSequences.generated'

type Definitions = DefinitionsFromApi<typeof generatedQuestionSequencesApi>

type GetQuestionsSequences = GetQuestionsSequencesQuery['getQuestionsSequences']
type CreateQuestionsSequence =
  CreateQuestionsSequenceMutation['createQuestionsSequence']['questionsSequence']

type UpdatedDefinitions = {
  getQuestionsSequences: OverrideResultType<
    Definitions['getQuestionsSequences'],
    GetQuestionsSequences
  >
  createQuestionsSequence: OverrideResultType<
    Definitions['createQuestionsSequence'],
    CreateQuestionsSequence
  >
}

const questionSequencesApi = generatedQuestionSequencesApi.enhanceEndpoints<
  'QuestionSequences',
  UpdatedDefinitions
>({
  endpoints: {
    getQuestionsSequences: {
      providesTags: ['QuestionsSequence'],
      transformResponse: (
        response: GetQuestionsSequencesQuery
      ): GetQuestionsSequences => response.getQuestionsSequences,
    },
    createQuestionsSequence: {
      invalidatesTags: ['QuestionsSequence'],
      transformResponse: (
        response: CreateQuestionsSequenceMutation
      ): CreateQuestionsSequence => response.createQuestionsSequence,
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetQuestionsSequencesQuery,
  useCreateQuestionsSequenceMutation,
} = questionSequencesApi

// export const { getVariable } = variableApi.endpoints
