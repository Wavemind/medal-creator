/**
 * The external imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  ValidateQuery,
  api as generatedValidateApi,
} from '../generated/validate.generated'

type Definitions = DefinitionsFromApi<typeof generatedValidateApi>

type GetValidate = ValidateQuery['validate']

type UpdatedDefinitions = Omit<Definitions, 'validate'> & {
  validate: OverrideResultType<Definitions['validate'], GetValidate>
}

export const validateApi = generatedValidateApi.enhanceEndpoints<
  'Validate',
  UpdatedDefinitions
>({
  endpoints: {
    validate: {
      providesTags: ['Validate'],
      transformResponse: (response: ValidateQuery): GetValidate =>
        response.validate,
    },
  },
})

export const { useLazyValidateQuery } = validateApi
