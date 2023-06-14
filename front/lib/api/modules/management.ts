/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import {
  createManagementDocument,
  getManagementDocument,
  getManagementsDocument,
  updateManagementDocument,
} from './documents/management'
import type {
  Paginated,
  PaginatedQueryWithProject,
  Management,
  ManagementQuery,
  ManagementEdge,
} from '@/types'

export const managementsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getManagement: build.query<Management, number>({
      query: id => ({
        document: getManagementDocument,
        variables: { id },
      }),
      transformResponse: (response: { getManagement: Management }) =>
        response.getManagement,
      providesTags: ['Management'],
    }),
    getManagements: build.query<
      Paginated<ManagementEdge>,
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
        getManagements: Paginated<ManagementEdge>
      }) => response.getManagements,
      providesTags: ['Management'],
    }),
    createManagement: build.mutation<Management, ManagementQuery>({
      query: values => ({
        document: createManagementDocument,
        variables: values,
      }),
      transformResponse: (response: {
        createManagement: { management: Management }
      }) => response.createManagement.management,
      invalidatesTags: ['Management'],
    }),
    updateManagement: build.mutation<
      Management,
      Partial<ManagementQuery> & Pick<Management, 'id'>
    >({
      query: values => ({
        document: updateManagementDocument,
        variables: values,
      }),
      transformResponse: (response: {
        updateManagement: { management: Management }
      }) => response.updateManagement.management,
      invalidatesTags: ['Management'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetManagementsQuery,
  useGetManagementsQuery,
  useGetManagementQuery,
  useCreateManagementMutation,
  useUpdateManagementMutation,
} = managementsApi

export const { getManagements } = managementsApi.endpoints
