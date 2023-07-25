/**
 * The internal imports
 */
import { api as generatedNodeExclusionApi } from '../generated/nodeExclusion.generated'

const nodeExclusionApi = generatedNodeExclusionApi.enhanceEndpoints({
  endpoints: {
    createNodeExclusions: {
      invalidatesTags: ['NodeExclusion', 'Instance'],
    },
    destroyNodeExclusion: {
      invalidatesTags: ['NodeExclusion'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useCreateNodeExclusionsMutation,
  useDestroyNodeExclusionMutation,
} = nodeExclusionApi
