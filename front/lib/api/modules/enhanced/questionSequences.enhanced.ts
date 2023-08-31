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
  GetQuestionsSequenceQuery,
} from '../generated/questionSequences.generated'

type Definitions = DefinitionsFromApi<typeof generatedQuestionSequencesApi>

type GetQuestionsSequence = GetQuestionsSequenceQuery['getQuestionsSequence']
type GetQuestionsSequences = GetQuestionsSequencesQuery['getQuestionsSequences']

type UpdatedDefinitions = {
  getQuestionsSequence: OverrideResultType<
    Definitions['getQuestionsSequence'],
    GetQuestionsSequence
  >
  getQuestionsSequences: OverrideResultType<
    Definitions['getQuestionsSequences'],
    GetQuestionsSequences
  >
}

const questionSequencesApi = generatedQuestionSequencesApi.enhanceEndpoints<
  'QuestionSequences',
  UpdatedDefinitions
>({
  endpoints: {
    getQuestionsSequence: {
      providesTags: ['QuestionsSequence'],
      transformResponse: (
        response: GetQuestionsSequenceQuery
      ): GetQuestionsSequence => response.getQuestionsSequence,
    },
    getQuestionsSequences: {
      providesTags: ['QuestionsSequence'],
      transformResponse: (
        response: GetQuestionsSequencesQuery
      ): GetQuestionsSequences => response.getQuestionsSequences,
    },
    createQuestionsSequence: {
      invalidatesTags: ['QuestionsSequence'],
    },
    updateQuestionsSequence: {
      invalidatesTags: ['QuestionsSequence'],
    },
    destroyQuestionsSequence: {
      invalidatesTags: ['QuestionsSequence'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetQuestionsSequencesQuery,
  useGetQuestionsSequenceQuery,
  useCreateQuestionsSequenceMutation,
  useDestroyQuestionsSequenceMutation,
  useUpdateQuestionsSequenceMutation,
} = questionSequencesApi
