/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getVariablesDocument } from './documents/variable'
import type { Paginated, PaginatedQueryWithProject, Variable } from '@/types'

export const variablesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getVariables: build.query<Paginated<Variable>, PaginatedQueryWithProject>({
      query: tableState => {
        return {
          document: getVariablesDocument,
          variables: tableState,
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
