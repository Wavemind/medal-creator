/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getAlgorithmsQuery from './getAlgorithms'

export const algorithmsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAlgorithms: getAlgorithmsQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetAlgorithmsQuery,
  util: { getRunningOperationPromises },
} = algorithmsApi

// Export endpoints for use in SSR
export const { getAlgorithms } = algorithmsApi.endpoints
