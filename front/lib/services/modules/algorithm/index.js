/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getAlgorithmsQuery from './getAlgorithms'
import getAlgorithmQuery from './getAlgorithm'
import createAlgorithmMutation from './createAlgorithm'
import updateAlgorithmMutation from './updateAlgorithm'
import destroyAlgorithmMutation from './destroyAlgorithm'

export const algorithmsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAlgorithm: getAlgorithmQuery(build),
    getAlgorithms: getAlgorithmsQuery(build),
    createAlgorithm: createAlgorithmMutation(build),
    updateAlgorithm: updateAlgorithmMutation(build),
    destroyAlgorithm: destroyAlgorithmMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetAlgorithmQuery,
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
} = algorithmsApi
