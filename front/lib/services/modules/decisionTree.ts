/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createDecisionTreeDocument,
  getDecisionTreeDocument,
  getDecisionTreesDocument,
  updateDecisionTreeDocument,
} from './documents/decisionTree'
import type { DecisionTree, DecisionTreeInputs } from '@/types/decisionTree'
import type { Paginated } from '@/types/common'

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
    getDecisionTrees: build.query<Paginated<DecisionTree>, { search?: string }>(
      {
        query: ({ search }) => ({
          document: getDecisionTreesDocument,
          variables: { searchTerm: search },
        }),
        transformResponse: (response: {
          getDecisionTrees: Paginated<DecisionTree>
        }) => response.getDecisionTrees,
        providesTags: ['DecisionTree'],
      }
    ),
    createDecisionTree: build.mutation<DecisionTree, DecisionTreeInputs>({
      query: values => ({
        document: createDecisionTreeDocument,
        variables: values,
      }),
      transformResponse: (response: {
        createDecisionTree: { decisionTree: DecisionTree }
      }) => response.createDecisionTree.decisionTree,
      invalidatesTags: ['DecisionTree'],
    }),
    updateDecisionTree: build.mutation<
      DecisionTree,
      Partial<DecisionTreeInputs> & Pick<DecisionTree, 'id'>
    >({
      query: values => ({
        document: updateDecisionTreeDocument,
        variables: values,
      }),
      transformResponse: (response: {
        updateDecisionTree: { decisionTree: DecisionTree }
      }) => response.updateDecisionTree.decisionTree,
      invalidatesTags: ['DecisionTree'],
    }),
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
