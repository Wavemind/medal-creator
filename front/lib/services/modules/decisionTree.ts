/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import getDecisionTreesQuery from './decisionTree/getDecisionTrees'
import createDecisionTreeMutation from './decisionTree/createDecisionTree'
import updateDecisionTreeMutation from './decisionTree/updateDecisionTree'
import { getDecisionTreeDocument } from './documents/decisionTree'
import { DecisionTree } from '@/types/decisionTree'

export const decisionTreesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDecisionTree: build.query<DecisionTree, number>({
      query: id => ({
        document: getDecisionTreeDocument,
        variables: { id },
      }),
      transformResponse: (response: { getDecisionTree: DecisionTree }) =>
      response.getDecisionTree,
      providesTags: ['DecisionTree'],
    }),
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
