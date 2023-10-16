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
  GetFormulaVariablesQuery,
  GetVariableQuery,
  EditVariableQuery,
  CreateVariableMutation,
  UpdateVariableMutation,
  api as generatedVariableApi,
} from '../generated/variable.generated'

type Definitions = DefinitionsFromApi<typeof generatedVariableApi>

type GetVariables = GetVariablesQuery['getVariables']
type GetFormulaVariables = GetFormulaVariablesQuery['getFormulaVariables']
type GetVariable = GetVariableQuery['getVariable']
export type EditVariable = EditVariableQuery['getVariable']
type CreateVariable = CreateVariableMutation['createVariable']['variable']
type UpdateVariable = UpdateVariableMutation['updateVariable']['variable']

type UpdatedDefinitions = {
  getVariables: OverrideResultType<Definitions['getVariables'], GetVariables>
  getFormulaVariables: OverrideResultType<
    Definitions['getFormulaVariables'],
    GetFormulaVariables
  >
  getVariable: OverrideResultType<Definitions['getVariable'], GetVariable>
  editVariable: OverrideResultType<Definitions['editVariable'], EditVariable>
  createVariable: OverrideResultType<
    Definitions['createVariable'],
    CreateVariable
  >
  updateVariable: OverrideResultType<
    Definitions['updateVariable'],
    UpdateVariable
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
      transformResponse: (response: UpdateVariableMutation): UpdateVariable =>
        response.updateVariable.variable,
    },
    getFormulaVariables: {
      providesTags: ['Variable'],
      transformResponse: (
        response: GetFormulaVariablesQuery
      ): GetFormulaVariables => response.getFormulaVariables,
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
  useLazyGetFormulaVariablesQuery,
  useLazyGetVariableQuery,
  useGetVariableQuery,
  useEditVariableQuery,
  useCreateVariableMutation,
  useUpdateVariableMutation,
  useDuplicateVariableMutation,
  useDestroyVariableMutation,
} = variableApi

export const { getVariable } = variableApi.endpoints
