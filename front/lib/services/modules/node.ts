/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getcomplaintCategoriesDocument } from './documents/node'
import { calculatePagination } from '@/lib/utils'
import type {
  Paginated,
  PaginatedQueryWithProject,
  ComplaintCategory,
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
