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
  GetInstancesQuery,
  api as generatedInstanceApi,
} from '../generated/instance.generated'

type Definitions = DefinitionsFromApi<typeof generatedInstanceApi>

type GetInstances = GetInstancesQuery['getInstances']

type UpdatedDefinitions = Omit<Definitions, 'getInstances'> & {
  getInstances: OverrideResultType<Definitions['getInstances'], GetInstances>
}

export const instanceApi = generatedInstanceApi.enhanceEndpoints<
  'Instance',
  UpdatedDefinitions
>({
  endpoints: {
    getInstances: {
      providesTags: ['Instance'],
      transformResponse: (response: GetInstancesQuery): GetInstances =>
        response.getInstances,
    },
  },
})

export const { useGetInstancesQuery } = instanceApi

// Export endpoints for use in SSR
export const { getInstances } = instanceApi.endpoints
