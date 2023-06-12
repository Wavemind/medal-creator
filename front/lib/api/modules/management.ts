/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import { getManagementsDocument } from './documents/management'
import type {
  Paginated,
  PaginatedQueryWithProject,
  GetManagementsQuery,
} from '@/types'

export const managementsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getManagements: build.query<
      Paginated<GetManagementsQuery>,
      PaginatedQueryWithProject
    >({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: getManagementsDocument,
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
        getManagements: Paginated<GetManagementsQuery>
      }) => response.getManagements,
      providesTags: ['Management'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetManagementsQuery, useGetManagementsQuery } =
  managementsApi

export const { getManagements } = managementsApi.endpoints
