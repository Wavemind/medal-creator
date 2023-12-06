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
  CreateQuestionsSequenceMutation,
  UpdateQuestionsSequenceMutation,
} from '../generated/questionSequences.generated'

type Definitions = DefinitionsFromApi<typeof generatedQuestionSequencesApi>

export type GetQuestionsSequence =
  GetQuestionsSequenceQuery['getQuestionsSequence']
type GetQuestionsSequences = GetQuestionsSequencesQuery['getQuestionsSequences']
type CreateQuestionsSequence =
  CreateQuestionsSequenceMutation['createQuestionsSequence']['questionsSequence']
type UpdateQuestionsSequence =
  UpdateQuestionsSequenceMutation['updateQuestionsSequence']['questionsSequence']

type UpdatedDefinitions = {
  getQuestionsSequence: OverrideResultType<
    Definitions['getQuestionsSequence'],
    GetQuestionsSequence
  >
  getQuestionsSequences: OverrideResultType<
    Definitions['getQuestionsSequences'],
    GetQuestionsSequences
  >
  createQuestionsSequence: OverrideResultType<
    Definitions['createQuestionsSequence'],
    CreateQuestionsSequence
  >
  updateQuestionsSequence: OverrideResultType<
    Definitions['updateQuestionsSequence'],
    UpdateQuestionsSequence
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
      transformResponse: (
        response: CreateQuestionsSequenceMutation
      ): CreateQuestionsSequence =>
        response.createQuestionsSequence.questionsSequence,
    },
    updateQuestionsSequence: {
      invalidatesTags: ['QuestionsSequence'],
      transformResponse: (
        response: UpdateQuestionsSequenceMutation
      ): UpdateQuestionsSequence =>
        response.updateQuestionsSequence.questionsSequence,
    },
    destroyQuestionsSequence: {
      invalidatesTags: ['QuestionsSequence'],
    },
  },
})

// SSR
export const { getQuestionsSequence } = questionSequencesApi.endpoints

// Export hooks for usage in functional components
export const {
  useLazyGetQuestionsSequencesQuery,
  useGetQuestionsSequenceQuery,
  useCreateQuestionsSequenceMutation,
  useDestroyQuestionsSequenceMutation,
  useUpdateQuestionsSequenceMutation,
} = questionSequencesApi
