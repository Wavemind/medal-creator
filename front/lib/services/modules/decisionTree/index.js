/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDecisionTreesQuery from './getDecisionTrees'
import destroyDecisionTreeMutation from './destroyDecisionTree'

export const decisionTreesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDecisionTrees: getDecisionTreesQuery(build),
    destroyDecisionTree: destroyDecisionTreeMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetDecisionTreesQuery, useDestroyDecisionTreeMutation } =
  decisionTreesApi
