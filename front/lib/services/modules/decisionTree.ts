/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createDecisionTreeDocument,
  destroyDecisionTreeDocument,
  getDecisionTreeDocument,
  getDecisionTreesDocument,
  updateDecisionTreeDocument,
} from './documents/decisionTree'
import calculatePagination from '@/lib/utils/calculatePagination'
import type { DecisionTree, DecisionTreeInputs } from '@/types/decisionTree'
import type { Paginated, PaginatedQueryWithProject } from '@/types/common'

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
    getDecisionTrees: build.query<
      Paginated<DecisionTree>,
      PaginatedQueryWithProject
    >({
      query: tableState => {
        const { algorithmId, endCursor, startCursor, search } = tableState
        return {
          document: getDecisionTreesDocument,
          variables: {
            algorithmId,
            after: endCursor,
            before: startCursor,
            searchTerm: search,
            ...calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: {
        getDecisionTrees: Paginated<DecisionTree>
      }) => response.getDecisionTrees,
      providesTags: ['DecisionTree'],
    }),
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
    destroyDecisionTree: build.mutation<void, number>({
      query: id => ({
        document: destroyDecisionTreeDocument,
        variables: { id },
      }),
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
  useDestroyDecisionTreeMutation,
} = decisionTreesApi