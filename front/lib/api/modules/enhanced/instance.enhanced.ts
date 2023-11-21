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
  CreateInstanceMutation,
  GetInstancesQuery,
  GetInstanceQuery,
  GetComponentsQuery,
  GetAvailableNodesQuery,
  api as generatedInstanceApi,
} from '../generated/instance.generated'

type Definitions = DefinitionsFromApi<typeof generatedInstanceApi>

export type GetInstances = GetInstancesQuery['getInstances']
export type GetInstance = GetInstanceQuery['getInstance']
export type CreateInstance = CreateInstanceMutation['createInstance']
export type GetComponents = GetComponentsQuery['getComponents']
export type GetAvailableNodes = GetAvailableNodesQuery['getAvailableNodes']

type UpdatedDefinitions = Omit<Definitions, 'getInstances'> & {
  createInstance: OverrideResultType<
    Definitions['createInstance'],
    CreateInstance
  >
  getInstances: OverrideResultType<Definitions['getInstances'], GetInstances>
  getInstance: OverrideResultType<Definitions['getInstance'], GetInstance>
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
    getInstance: {
      providesTags: ['Instance'],
      transformResponse: (response: GetInstanceQuery): GetInstance =>
        response.getInstance,
    },
    getComponents: {
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
      transformResponse: (response: CreateInstanceMutation): CreateInstance =>
        response.createInstance,
    },
    updateInstance: {},
    destroyInstance: {
      invalidatesTags: ['Instance'],
    },
  },
})

// Export endpoints for use in SSR
export const { getComponents } = instanceApi.endpoints

export const {
  useGetInstancesQuery,
  useGetInstanceQuery,
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useGetComponentsQuery,
  useLazyGetAvailableNodesQuery,
  useDestroyInstanceMutation,
} = instanceApi
