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
  GetAlgorithmsQuery,
  GetAlgorithmQuery,
  api as generatedAlgorithmApi,
  GetAlgorithmOrderingQuery,
} from '../generated/algorithm.generated'

type Definitions = DefinitionsFromApi<typeof generatedAlgorithmApi>

export type GetAlgorithms = GetAlgorithmsQuery['getAlgorithms']
export type GetAlgorithm = GetAlgorithmQuery['getAlgorithm']
type GetAlgorithmOrdering = GetAlgorithmOrderingQuery['getAlgorithm']

type UpdatedDefinitions = {
  getAlgorithms: OverrideResultType<Definitions['getAlgorithms'], GetAlgorithms>
  getAlgorithm: OverrideResultType<Definitions['getAlgorithm'], GetAlgorithm>
  getAlgorithmOrdering: OverrideResultType<
    Definitions['getAlgorithmOrdering'],
    GetAlgorithmOrdering
  >
}

const algorithmApi = generatedAlgorithmApi.enhanceEndpoints<
  'Algorithm',
  UpdatedDefinitions
>({
  endpoints: {
    getAlgorithms: {
      providesTags: ['Algorithm'],
      transformResponse: (response: GetAlgorithmsQuery): GetAlgorithms =>
        response.getAlgorithms,
    },
    getAlgorithmOrdering: {
      providesTags: ['Algorithm'],
      transformResponse: (
        response: GetAlgorithmOrderingQuery
      ): GetAlgorithmOrdering => response.getAlgorithm,
    },
    getAlgorithm: {
      providesTags: ['Algorithm'],
      transformResponse: (response: GetAlgorithmQuery): GetAlgorithm =>
        response.getAlgorithm,
    },
    createAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
    updateAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
    destroyAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useGetAlgorithmQuery,
  useGetAlgorithmOrderingQuery,
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
} = algorithmApi

// Export endpoints for use in SSR
export const { getAlgorithm, getAlgorithmOrdering } = algorithmApi.endpoints
