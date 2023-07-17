/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetVariablesQuery,
  GetVariableQuery,
  api as generatedVariableApi,
  EditVariableQuery,
  CreateVariableMutation,
} from '../generated/variable.generated'

type Definitions = DefinitionsFromApi<typeof generatedVariableApi>

type GetVariables = GetVariablesQuery['getVariables']
type GetVariable = GetVariableQuery['getVariable']
export type EditVariable = EditVariableQuery['getVariable']
type CreateVariable = CreateVariableMutation['createVariable']['variable']

type UpdatedDefinitions = {
  getVariables: OverrideResultType<Definitions['getVariables'], GetVariables>
  getVariable: OverrideResultType<Definitions['getVariable'], GetVariable>
  editVariable: OverrideResultType<Definitions['editVariable'], EditVariable>
  createVariable: OverrideResultType<
    Definitions['createVariable'],
    CreateVariable
  >
}

const variableApi = generatedVariableApi.enhanceEndpoints<
  'Variable',
  UpdatedDefinitions
>({
  endpoints: {
    getVariables: {
      providesTags: ['Variable'],
      transformResponse: (response: GetVariablesQuery): GetVariables =>
        response.getVariables,
    },
    getVariable: {
      providesTags: ['Variable'],
      transformResponse: (response: GetVariableQuery): GetVariable =>
        response.getVariable,
    },
    createVariable: {
      invalidatesTags: ['Variable'],
      transformResponse: (response: CreateVariableMutation): CreateVariable =>
        response.createVariable.variable,
    },
    editVariable: {
      transformResponse: (response: EditVariableQuery): EditVariable =>
        response.getVariable,
      providesTags: ['Variable'],
    },
    updateVariable: {
      invalidatesTags: ['Variable'],
    },
    destroyVariable: {
      invalidatesTags: ['Variable'],
    },
    duplicateVariable: {
      invalidatesTags: ['Variable'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetVariablesQuery,
  useGetVariableQuery,
  useEditVariableQuery,
  useCreateVariableMutation,
  useUpdateVariableMutation,
  useDuplicateVariableMutation,
  useDestroyVariableMutation,
} = variableApi

export const { getVariable } = variableApi.endpoints
