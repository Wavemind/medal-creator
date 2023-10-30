/**
 * The external imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetAnswerTypesQuery,
  api as generatedAnswerTypeApi,
} from '../generated/answerType.generated'

type Definitions = DefinitionsFromApi<typeof generatedAnswerTypeApi>

type GetAnswerTypes = GetAnswerTypesQuery['getAnswerTypes']

type UpdatedDefinitions = Omit<Definitions, 'getAnswerTypes'> & {
  getAnswerTypes: OverrideResultType<
    Definitions['getAnswerTypes'],
    GetAnswerTypes
  >
}

export const answerTypeApi = generatedAnswerTypeApi.enhanceEndpoints<
  'AnswerType',
  UpdatedDefinitions
>({
  endpoints: {
    getAnswerTypes: {
      providesTags: ['AnswerType'],
      transformResponse: (response: GetAnswerTypesQuery): GetAnswerTypes =>
        response.getAnswerTypes,
    },
  },
})

export const { useGetAnswerTypesQuery } = answerTypeApi

// Export endpoints for use in SSR
export const { getAnswerTypes } = answerTypeApi.endpoints
