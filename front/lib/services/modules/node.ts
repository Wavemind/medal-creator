/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getcomplaintCategoriesDocument } from './queries/node'
import calculatePagination from '@/lib/utils/calculatePagination'
import type { Paginated, PaginatedQueryWithProject } from '@/types/common'
import type { ComplaintCategory } from '@/types/node'

export const nodesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getComplaintCategories: build.query<
      Paginated<ComplaintCategory>,
      PaginatedQueryWithProject
    >({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: getcomplaintCategoriesDocument,
          variables: {
            projectId,
            after: endCursor,
            before: startCursor,
            searchTerm: search,
            ...calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: {
        getComplaintCategories: Paginated<ComplaintCategory>
      }) => response.getComplaintCategories,
      providesTags: ['Node'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetComplaintCategoriesQuery } = nodesApi
