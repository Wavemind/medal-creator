/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import {
  getAvailableNodesDocument,
  getComplaintCategoriesDocument,
} from './documents/node'
import type {
  Paginated,
  PaginatedQueryWithProject,
  ComplaintCategory,
  AvailableNode,
  AvailableNodeInput,
} from '@/types'

export const nodesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getComplaintCategories: build.query<
      Paginated<ComplaintCategory>,
      PaginatedQueryWithProject
    >({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: getComplaintCategoriesDocument,
          variables: {
            projectId,
            after: endCursor,
            before: startCursor,
            searchTerm: search,
            ...DatatableService.calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: {
        getComplaintCategories: Paginated<ComplaintCategory>
      }) => response.getComplaintCategories,
      providesTags: ['Variable'],
    }),
    getAvailableNodes: build.query<AvailableNode[], AvailableNodeInput>({
      query: ({ instanceableId, instanceableType, searchTerm }) => ({
        document: getAvailableNodesDocument,
        variables: { instanceableId, instanceableType, searchTerm },
      }),
      transformResponse: (response: { getAvailableNodes: AvailableNode[] }) =>
        response.getAvailableNodes,
      providesTags: ['AvailableNode'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetComplaintCategoriesQuery, useLazyGetAvailableNodesQuery } =
  nodesApi
