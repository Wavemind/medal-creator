/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetDecisionTreesQuery,
  GetDecisionTreeQuery,
  api as generatedDecisionTreeApi,
  CreateDecisionTreeMutation,
} from '../generated/decisionTree.generated'

type Definitions = DefinitionsFromApi<typeof generatedDecisionTreeApi>

type GetDecisionTrees = GetDecisionTreesQuery['getDecisionTrees']
type GetDecisionTree = GetDecisionTreeQuery['getDecisionTree']
type CreateDecisionTree =
  CreateDecisionTreeMutation['createDecisionTree']['decisionTree']

type UpdatedDefinitions = {
  getDecisionTrees: OverrideResultType<
    Definitions['getDecisionTrees'],
    GetDecisionTrees
  >
  getDecisionTree: OverrideResultType<
    Definitions['getDecisionTree'],
    GetDecisionTree
  >
  createDecisionTree: OverrideResultType<
    Definitions['createDecisionTree'],
    CreateDecisionTree
  >
}

const decisionTreeApi = generatedDecisionTreeApi.enhanceEndpoints<
  'DecisionTree',
  UpdatedDefinitions
>({
  endpoints: {
    getDecisionTrees: {
      providesTags: ['DecisionTree'],
      transformResponse: (response: GetDecisionTreesQuery): GetDecisionTrees =>
        response.getDecisionTrees,
    },
    getDecisionTree: {
      providesTags: ['DecisionTree'],
      transformResponse: (response: GetDecisionTreeQuery): GetDecisionTree =>
        response.getDecisionTree,
    },
    createDecisionTree: {
      invalidatesTags: ['DecisionTree'],
      transformResponse: (
        response: CreateDecisionTreeMutation
      ): CreateDecisionTree => response.createDecisionTree?.decisionTree,
    },
    updateDecisionTree: {
      invalidatesTags: ['DecisionTree'],
    },
    destroyDecisionTree: {
      invalidatesTags: ['DecisionTree'],
    },
    duplicateDecisionTree: {
      invalidatesTags: ['DecisionTree'],
    },
  },
})

// SSR
export const { getDecisionTree } = decisionTreeApi.endpoints

// Export hooks for usage in functional components
export const {
  useLazyGetDecisionTreesQuery,
  useGetDecisionTreeQuery,
  useCreateDecisionTreeMutation,
  useUpdateDecisionTreeMutation,
  useDestroyDecisionTreeMutation,
  useDuplicateDecisionTreeMutation,
} = decisionTreeApi
