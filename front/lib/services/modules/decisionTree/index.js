/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDecisionTreeQuery from './getDecisionTree'
import getDecisionTreesQuery from './getDecisionTrees'
import createDecisionTreeMutation from './createDecisionTree'
import updateDecisionTreeMutation from './updateDecisionTree'

export const decisionTreesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDecisionTree: getDecisionTreeQuery(build),
    getDecisionTrees: getDecisionTreesQuery(build),
    createDecisionTree: createDecisionTreeMutation(build),
    updateDecisionTree: updateDecisionTreeMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetDecisionTreesQuery,
  useGetDecisionTreeQuery,
  useCreateDecisionTreeMutation,
  useUpdateDecisionTreeMutation,
} = decisionTreesApi
