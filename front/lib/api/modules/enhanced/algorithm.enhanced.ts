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
} from '../generated/algorithm.generated'

type Definitions = DefinitionsFromApi<typeof generatedAlgorithmApi>

type GetAlgorithms = GetAlgorithmsQuery['getAlgorithms']
type GetAlgorithm = GetAlgorithmQuery['getAlgorithm']

type UpdatedDefinitions = Omit<
  Definitions,
  'getAlgorithms' | 'getAlgorithm'
> & {
  getAlgorithms: OverrideResultType<Definitions['getAlgorithms'], GetAlgorithms>
  getAlgorithm: OverrideResultType<Definitions['getAlgorithm'], GetAlgorithm>
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
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
} = algorithmApi

// Export endpoints for use in SSR
export const { getAlgorithm } = algorithmApi.endpoints
