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
} from '../generated/questionSequences.generated'

type Definitions = DefinitionsFromApi<typeof generatedQuestionSequencesApi>

type GetQuestionsSequences = GetQuestionsSequencesQuery['getQuestionsSequences']

type UpdatedDefinitions = {
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
    getQuestionsSequences: {
      providesTags: ['QuestionSequences'],
      transformResponse: (
        response: GetQuestionsSequencesQuery
      ): GetQuestionsSequences => response.getQuestionsSequences,
    },
  },
})

// Export hooks for usage in functional components
export const { useLazyGetQuestionsSequencesQuery } = questionSequencesApi

// export const { getVariable } = variableApi.endpoints
