/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import {
  createDrugDocument,
  destroyDrugDocument,
  getDrugsDocument,
} from './documents/drug'
import type {
  Paginated,
  PaginatedQueryWithProject,
  Drug,
  DrugQuery,
} from '@/types'

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
    createDrug: build.mutation<Drug, DrugQuery>({
      query: values => ({
        document: createDrugDocument,
        variables: values,
      }),
      transformResponse: (response: { createDrug: { drug: Drug } }) =>
        response.createDrug.drug,
      invalidatesTags: ['Drug'],
    }),
    destroyDrug: build.mutation<void, number>({
      query: id => ({
        document: destroyDrugDocument,
        variables: { id },
      }),
      invalidatesTags: ['Drug'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetDrugsQuery,
  useDestroyDrugMutation,
  useCreateDrugMutation,
} = drugsApi
