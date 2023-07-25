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
  GetComponentsQuery,
  GetAvailableNodesQuery,
  api as generatedInstanceApi,
} from '../generated/instance.generated'

type Definitions = DefinitionsFromApi<typeof generatedInstanceApi>

export type GetInstances = GetInstancesQuery['getInstances']
export type GetComponents = GetComponentsQuery['getComponents']
export type GetAvailableNodes = GetAvailableNodesQuery['getAvailableNodes']

type UpdatedDefinitions = Omit<Definitions, 'getInstances'> & {
  getInstances: OverrideResultType<Definitions['getInstances'], GetInstances>
  getComponents: OverrideResultType<Definitions['getComponents'], GetComponents>
  getAvailableNodes: OverrideResultType<
    Definitions['getAvailableNodes'],
    GetAvailableNodes
  >
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
    getComponents: {
      providesTags: ['Instance'],
      transformResponse: (response: GetComponentsQuery): GetComponents =>
        response.getComponents,
    },
    getAvailableNodes: {
      providesTags: ['Instance'],
      transformResponse: (
        response: GetAvailableNodesQuery
      ): GetAvailableNodes => response.getAvailableNodes,
    },
    createInstance: {
      invalidatesTags: ['Instance'],
    },
    updateInstance: {
      invalidatesTags: ['Instance'],
    },
    destroyInstance: {
      invalidatesTags: ['Instance'],
    },
  },
})

// Export endpoints for use in SSR
export const { getComponents } = instanceApi.endpoints

export const {
  useGetInstancesQuery,
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useGetComponentsQuery,
  useLazyGetAvailableNodesQuery,
  useDestroyInstanceMutation,
} = instanceApi
