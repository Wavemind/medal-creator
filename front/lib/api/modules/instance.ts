/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createInstanceDocument,
  getAvailableNodesDocument,
  getComponentsDocument,
  getInstancesDocument,
} from './documents/instance'
import type {
  Instance,
  InstanceInput,
  Component,
  AvailableNode,
  AvailableNodeInput,
} from '@/types'

export const instancesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getInstances: build.query<
      Instance[],
      { nodeId: number; algorithmId?: number }
    >({
      query: ({ nodeId, algorithmId }) => ({
        document: getInstancesDocument,
        variables: { nodeId, algorithmId },
      }),
      transformResponse: (response: { getInstances: Instance[] }) =>
        response.getInstances,
    }),
    createInstance: build.mutation<{ id: string }, InstanceInput>({
      query: values => ({
        document: createInstanceDocument,
        variables: values,
      }),
      transformResponse: (response: {
        createInstance: { instance: { id: string } }
      }) => response.createInstance.instance,
      invalidatesTags: ['AvailableNode'],
    }),
    getAvailableNodes: build.query<AvailableNode[], AvailableNodeInput>({
      query: ({ instanceableId, instanceableType, searchTerm }) => ({
        document: getAvailableNodesDocument,
        variables: { instanceableId, instanceableType, searchTerm },
      }),
      transformResponse: (response: { getAvailableNodes: AvailableNode[] }) =>
        response.getAvailableNodes,
      providesTags: ['AvailableNode'],
    }),
    getComponents: build.query<
      Component[],
      { instanceableId: string; instanceableType: string }
    >({
      query: ({ instanceableId, instanceableType }) => ({
        document: getComponentsDocument,
        variables: { instanceableId, instanceableType },
      }),
      transformResponse: (response: { getComponents: Component[] }) =>
        response.getComponents,
    }),
  }),
  overrideExisting: false,
})

// SSR
export const { getComponents } = instancesApi.endpoints

// Export hooks for usage in functional components
export const {
  useGetInstancesQuery,
  useCreateInstanceMutation,
  useGetComponentsQuery,
  useLazyGetAvailableNodesQuery,
} = instancesApi
