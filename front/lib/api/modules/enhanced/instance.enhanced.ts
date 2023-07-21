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
  GetComponentsQuery,
  GetAvailableNodesQuery,
  CreateInstanceMutation,
} from '../generated/instance.generated'

type Definitions = DefinitionsFromApi<typeof generatedInstanceApi>

export type GetInstances = GetInstancesQuery['getInstances']
export type GetComponents = GetComponentsQuery['getComponents']
export type GetAvailableNodes = GetAvailableNodesQuery['getAvailableNodes']
export type CreateInstance =
  CreateInstanceMutation['createInstance']['instance']

type UpdatedDefinitions = Omit<Definitions, 'getInstances'> & {
  getInstances: OverrideResultType<Definitions['getInstances'], GetInstances>
  getComponents: OverrideResultType<Definitions['getComponents'], GetComponents>
  getAvailableNodes: OverrideResultType<
    Definitions['getAvailableNodes'],
    GetAvailableNodes
  >
  createInstance: OverrideResultType<
    Definitions['createInstance'],
    CreateInstance
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
      invalidatesTags: ['Instance'], // TODO : Check if this updates available nodes
      transformResponse: (response: CreateInstanceMutation): CreateInstance =>
        response.createInstance?.instance,
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
