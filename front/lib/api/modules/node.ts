/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import { getcomplaintCategoriesDocument } from './documents/node'
import type {
  Paginated,
  PaginatedQueryWithProject,
  ComplaintCategory,
} from '@/types'

// TODO MIGRATE IT IN VARIABLE
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
            ...DatatableService.calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: {
        getComplaintCategories: Paginated<ComplaintCategory>
      }) => response.getComplaintCategories,
      providesTags: ['Variable'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetComplaintCategoriesQuery } = nodesApi
