/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import { getDrugsDocument } from './documents/drug'
import type { Paginated, PaginatedQueryWithProject, Drug } from '@/types'

export const drugsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDrugs: build.query<Paginated<Drug>, PaginatedQueryWithProject>({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: getDrugsDocument,
          variables: {
            projectId,
            after: endCursor,
            before: startCursor,
            searchTerm: search,
            ...DatatableService.calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: { getDrugs: Paginated<Drug> }) =>
        response.getDrugs,
      providesTags: ['Drug'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetDrugsQuery } = drugsApi
