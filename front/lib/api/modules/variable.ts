/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import { getVariablesDocument } from './documents/variable'
import type { Paginated, PaginatedQueryWithProject, Variable } from '@/types'

export const variablesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getVariables: build.query<Paginated<Variable>, PaginatedQueryWithProject>({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: getVariablesDocument,
          variables: {
            projectId,
            after: endCursor,
            before: startCursor,
            searchTerm: search,
            ...DatatableService.calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: { getVariables: Paginated<Variable> }) =>
        response.getVariables,
      providesTags: ['Variable'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetVariablesQuery } = variablesApi
