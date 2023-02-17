/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import getAlgorithmsQuery from './getAlgorithms'
// import getAlgorithmQuery from './getAlgorithm'
import createAlgorithmMutation from './createAlgorithm'
import updateAlgorithmMutation from './updateAlgorithm'
import destroyAlgorithmMutation from './destroyAlgorithm'

// import type { Paginated } from '@/types/common'
import { getAlgorithmDocument } from './documents/algorithm'
import type { Algorithm } from '@/types/algorithm'

export const algorithmsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAlgorithm: build.query<Algorithm, string>({
      query: id => ({
        document: getAlgorithmDocument,
        variables: { id },
      }),
      transformResponse: (response: { getAlgorithm: Algorithm }) =>
        response.getAlgorithm,
      providesTags: ['Algorithm'],
    }),
    getAlgorithms: getAlgorithmsQuery(build),
    createAlgorithm: createAlgorithmMutation(build),
    updateAlgorithm: updateAlgorithmMutation(build),
    destroyAlgorithm: destroyAlgorithmMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetAlgorithmQuery,
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
} = algorithmsApi

// Export endpoints for use in SSR
export const { getAlgorithm } = algorithmsApi.endpoints
