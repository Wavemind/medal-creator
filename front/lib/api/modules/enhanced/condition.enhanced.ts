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
  GetConditionQuery,
  api as generatedConditionApi,
} from '../generated/condition.generated'

type Definitions = DefinitionsFromApi<typeof generatedConditionApi>

type GetCondition = GetConditionQuery['getCondition']

type UpdatedDefinitions = {
  getCondition: OverrideResultType<Definitions['getCondition'], GetCondition>
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
    },
    updateCondition: {
      invalidatesTags: ['Condition', 'Instance'],
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
