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
  api as generatedConditionApi,
} from '../generated/condition.generated'

type Definitions = DefinitionsFromApi<typeof generatedConditionApi>

type GetCondition = GetConditionQuery['getCondition']
type CreateCondition = CreateConditionMutation['createCondition']

type UpdatedDefinitions = {
  getCondition: OverrideResultType<Definitions['getCondition'], GetCondition>
  createCondition: OverrideResultType<
    Definitions['createCondition'],
    CreateCondition
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
      transformResponse: (response: CreateConditionMutation): CreateCondition =>
        response.createCondition,
    },
    updateCondition: {
      invalidatesTags: ['Condition'],
    },
    destroyCondition: {
      invalidatesTags: ['Condition'], // Realy need it ?
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
