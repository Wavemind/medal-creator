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
  CreateConditionMutation,
  GetConditionQuery,
  UpdateConditionMutation,
  api as generatedConditionApi,
} from '../generated/condition.generated'

type Definitions = DefinitionsFromApi<typeof generatedConditionApi>

export type GetCondition = GetConditionQuery['getCondition']
type CreateCondition = CreateConditionMutation['createCondition']['condition']
type UpdateCondition = UpdateConditionMutation['updateCondition']['condition']

type UpdatedDefinitions = {
  getCondition: OverrideResultType<Definitions['getCondition'], GetCondition>
  createCondition: OverrideResultType<
    Definitions['createCondition'],
    CreateCondition
  >
  updateCondition: OverrideResultType<
    Definitions['updateCondition'],
    UpdateCondition
  >
}

const conditionApi = generatedConditionApi.enhanceEndpoints<
  'Condition',
  UpdatedDefinitions
>({
  endpoints: {
    getCondition: {
      providesTags: ['Condition'],
      transformResponse: (response: GetConditionQuery): GetCondition =>
        response.getCondition,
    },
    createCondition: {
      invalidatesTags: ['Condition'],
      transformResponse: (response: CreateConditionMutation): CreateCondition =>
        response.createCondition.condition,
    },
    updateCondition: {
      invalidatesTags: ['Condition'],
      transformResponse: (response: UpdateConditionMutation): UpdateCondition =>
        response.updateCondition.condition,
    },
    destroyCondition: {
      invalidatesTags: ['Condition'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useGetConditionQuery,
  useCreateConditionMutation,
  useUpdateConditionMutation,
  useDestroyConditionMutation,
} = conditionApi
