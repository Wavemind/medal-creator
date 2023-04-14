/**
 * The internal imports
 */
import { api as generatedAlgorithmApi } from '../generated/algorithm.generated'

export const algorithmApi = generatedAlgorithmApi.enhanceEndpoints({
  addTagTypes: ['Algorithm'],
  endpoints: {
    getAlgorithm: {
      providesTags: ['Algorithm'],
      transformResponse: response => response.getAlgorithm,
    },
    getAlgorithms: {
      providesTags: ['Algorithm'],
      transformResponse: response => response.getAlgorithms,
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
