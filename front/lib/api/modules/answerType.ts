/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import { getcomplaintCategoriesDocument } from './documents/node'
import type { Paginated, ComplaintCategory, AnswerType } from '@/types'

export const answerTypesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAnswerTypes: build.query<Paginated<AnswerType>, Array<AnswerType>>({
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
export const { useGetComplaintCategoriesQuery } = answerTypesApi
