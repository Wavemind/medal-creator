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
  GetHealthCaresExclusionsQuery,
  api as generatedNodeExclusionApi,
} from '../generated/nodeExclusion.generated'

type Definitions = DefinitionsFromApi<typeof generatedNodeExclusionApi>

type GetDiagnosesExclusions =
  GetDiagnosesExclusionsQuery['getDiagnosesExclusions']
type GetHealthCaresExclusions =
  GetHealthCaresExclusionsQuery['getHealthCaresExclusions']

type UpdatedDefinitions = Omit<Definitions, 'getDiagnosesExclusions'> & {
  getDiagnosesExclusions: OverrideResultType<
    Definitions['getDiagnosesExclusions'],
    GetDiagnosesExclusions
  >
  getHealthCaresExclusions: OverrideResultType<
    Definitions['getHealthCaresExclusions'],
    GetHealthCaresExclusions
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
    getHealthCaresExclusions: {
      providesTags: ['HealthCareExclusion'],
      transformResponse: (
        response: GetHealthCaresExclusionsQuery
      ): GetHealthCaresExclusions => response.getHealthCaresExclusions,
    },
    createNodeExclusions: {
      invalidatesTags: [
        'NodeExclusion',
        'HealthCareExclusion',
        'Drug',
        'Management',
      ],
    },
    destroyNodeExclusion: {
      invalidatesTags: [
        'NodeExclusion',
        'HealthCareExclusion',
        'Drug',
        'Management',
      ],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesExclusionsQuery,
  useLazyGetHealthCaresExclusionsQuery,
  useCreateNodeExclusionsMutation,
  useDestroyNodeExclusionMutation,
} = nodeExclusionApi
