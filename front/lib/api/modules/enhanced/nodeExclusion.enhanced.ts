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
  GetDiagnosesExclusionsQuery,
  api as generatedNodeExclusionApi,
} from '../generated/nodeExclusion.generated'

type Definitions = DefinitionsFromApi<typeof generatedNodeExclusionApi>

type GetDiagnosesExclusions =
  GetDiagnosesExclusionsQuery['getDiagnosesExclusions']

type UpdatedDefinitions = Omit<Definitions, 'getDiagnosesExclusions'> & {
  getDiagnosesExclusions: OverrideResultType<
    Definitions['getDiagnosesExclusions'],
    GetDiagnosesExclusions
  >
}

const nodeExclusionApi = generatedNodeExclusionApi.enhanceEndpoints<
  'NodeExclusion',
  UpdatedDefinitions
>({
  endpoints: {
    getDiagnosesExclusions: {
      providesTags: ['NodeExclusion'],
      transformResponse: (
        response: GetDiagnosesExclusionsQuery
      ): GetDiagnosesExclusions => response.getDiagnosesExclusions,
    },
    createNodeExclusions: {
      invalidatesTags: ['NodeExclusion', 'Drug', 'Management'],
    },
    destroyNodeExclusion: {
      invalidatesTags: ['NodeExclusion', 'Drug', 'Management'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesExclusionsQuery,
  useCreateNodeExclusionsMutation,
  useDestroyNodeExclusionMutation,
} = nodeExclusionApi
