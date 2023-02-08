/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDecisionTreesQuery from './getDecisionTrees'
import createDecisionTreeMutation from './createDecisionTree'

export const decisionTreesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDecisionTrees: getDecisionTreesQuery(build),
    createDecisionTree: createDecisionTreeMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetDecisionTreesQuery, useCreateDecisionTreeMutation } =
  decisionTreesApi
