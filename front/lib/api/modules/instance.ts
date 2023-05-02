/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getInstancesDocument } from './documents/instance'
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
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetInstancesQuery } = instancesApi
