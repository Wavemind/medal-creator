/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
  TagTypesFromApi,
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
type TagTypes = TagTypesFromApi<typeof generatedAlgorithmApi>

type GetAlgorithm = GetAlgorithmQuery['getAlgorithm']
type GetAlgorithms = GetAlgorithmsQuery['getAlgorithms']

type UpdatedDefinitions = Omit<
  Definitions,
  'getAlgorithms' | 'getAlgorithm'
> & {
  getAlgorithms: OverrideResultType<Definitions['getAlgorithms'], GetAlgorithms>
  getAlgorithm: OverrideResultType<Definitions['getAlgorithm'], GetAlgorithm>
}

export const algorithmApi = generatedAlgorithmApi.enhanceEndpoints<
  TagTypes,
  UpdatedDefinitions
>({
  endpoints: {
    getAlgorithm: {
      providesTags: ['Algorithm'],
      transformResponse: (response: GetAlgorithmQuery): GetAlgorithm =>
        response.getAlgorithm,
    },
    getAlgorithms: {
      providesTags: ['Algorithm'],
      transformResponse: (response: GetAlgorithmsQuery): GetAlgorithms =>
        response.getAlgorithms,
    },
    createAlgorithm: {
      invalidatesTags: ['Algorithm'],
      transformResponse: response => response.createAlgorithm.algorithm,
    },
    updateAlgorithm: {
      invalidatesTags: ['Algorithm'],
      transformResponse: response => response.updateAlgorithm.algorithm,
    },
    destroyAlgorithm: {
      invalidatesTags: ['Algorithm'],
      transformResponse: response => response.destroyAlgorithm.algorithm,
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
