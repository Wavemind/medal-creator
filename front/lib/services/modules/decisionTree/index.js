/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDecisionTreesQuery from './getDecisionTrees'

export const decisionTreesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDecisionTrees: getDecisionTreesQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetDecisionTreesQuery } = decisionTreesApi
