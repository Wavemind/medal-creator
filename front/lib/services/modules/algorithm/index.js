/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getAlgorithmsQuery from './getAlgorithms'
import createAlgorithmMutation from './createAlgorithm'

export const algorithmsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAlgorithms: getAlgorithmsQuery(build),
    createAlgorithm: createAlgorithmMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetAlgorithmsQuery, useCreateAlgorithmMutation } =
  algorithmsApi

// Export endpoints for use in SSR
export const { getAlgorithms } = algorithmsApi.endpoints
