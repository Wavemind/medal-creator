/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createInstanceDocument,
  getInstancesDocument,
} from './documents/instance'
import type { Instance, InstanceInput } from '@/types'

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
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetInstancesQuery, useCreateInstanceMutation } = instancesApi
