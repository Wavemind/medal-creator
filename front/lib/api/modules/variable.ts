/**
 * The internal imports
 */
import { DatatableService } from '@/lib/services'
import { apiGraphql } from '../apiGraphql'
import {
  createVariableDocument,
  destroyVariableDocument,
  duplicateVariableDocument,
  getVariableDocument,
  getVariablesDocument,
} from './documents/variable'
import type {
  Paginated,
  PaginatedQueryWithProject,
  Variable,
  VariableInputs,
} from '@/types'

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
    getVariable: build.query<Variable, number>({
      query: id => ({
        document: getVariableDocument,
        variables: { id },
      }),
      transformResponse: (response: { getVariable: Variable }) =>
        response.getVariable,
      providesTags: ['Variable'],
    }),
    createVariable: build.mutation<Variable, VariableInputs>({
      query: values => ({
        document: createVariableDocument,
        variables: values,
      }),
      transformResponse: (response: {
        createVariable: { variable: Variable }
      }) => response.createVariable.variable,
      invalidatesTags: ['Variable'],
    }),
    duplicateVariable: build.mutation<void, number>({
      query: id => ({
        document: duplicateVariableDocument,
        variables: { id },
      }),
      invalidatesTags: ['Variable'],
    }),
    destroyVariable: build.mutation<void, number>({
      query: id => ({
        document: destroyVariableDocument,
        variables: { id },
      }),
      invalidatesTags: ['Variable'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetVariablesQuery,
  useGetVariableQuery,
  useCreateVariableMutation,
  useDuplicateVariableMutation,
  useDestroyVariableMutation,
} = variablesApi

export const { getVariable } = variablesApi.endpoints
