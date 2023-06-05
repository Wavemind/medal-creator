/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getcomplaintCategoriesDocument } from './documents/node'
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
        return {
          document: getcomplaintCategoriesDocument,
          variables: tableState,
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
