/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createInstanceDocument,
  getInstancesDocument,
} from './documents/instance'
import type { Instance } from '@/types'

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
    // TODO TYPES
    createInstance: build.mutation({
      query: values => ({
        document: createInstanceDocument,
        variables: values,
      }),
      transformResponse: (response: { createInstance: { instance } }) =>
        response.createInstance.instance,
      invalidatesTags: ['AvailableNode'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetInstancesQuery, useCreateInstanceMutation } = instancesApi
