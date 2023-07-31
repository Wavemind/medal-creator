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
  GetDiagnosesQuery,
  GetDiagnosisQuery,
  CreateDiagnosisMutation,
  api as generatedDiagnosisApi,
  UpdateDiagnosisMutation,
} from '../generated/diagnosis.generated'

type Definitions = DefinitionsFromApi<typeof generatedDiagnosisApi>

type GetDiagnoses = GetDiagnosesQuery['getDiagnoses']
type GetDiagnosis = GetDiagnosisQuery['getDiagnosis']
export type CreateDiagnosis =
  CreateDiagnosisMutation['createDiagnosis']['instance']
type UpdateDiagnosis = UpdateDiagnosisMutation['updateDiagnosis']['diagnosis']

type UpdatedDefinitions = {
  getDiagnoses: OverrideResultType<Definitions['getDiagnoses'], GetDiagnoses>
  getDiagnosis: OverrideResultType<Definitions['getDiagnosis'], GetDiagnosis>
  createDiagnosis: OverrideResultType<
    Definitions['createDiagnosis'],
    CreateDiagnosis
  >
  updateDiagnosis: OverrideResultType<
    Definitions['updateDiagnosis'],
    UpdateDiagnosis
  >
}

const diagnosisApi = generatedDiagnosisApi.enhanceEndpoints<
  'Diagnosis',
  UpdatedDefinitions
>({
  endpoints: {
    getDiagnoses: {
      providesTags: ['Diagnosis'],
      transformResponse: (response: GetDiagnosesQuery): GetDiagnoses =>
        response.getDiagnoses,
    },
    getDiagnosis: {
      providesTags: ['Diagnosis'],
      transformResponse: (response: GetDiagnosisQuery): GetDiagnosis =>
        response.getDiagnosis,
    },
    createDiagnosis: {
      invalidatesTags: ['Diagnosis'],
      transformResponse: (response: CreateDiagnosisMutation): CreateDiagnosis =>
        response.createDiagnosis.instance,
    },
    updateDiagnosis: {
      invalidatesTags: ['Diagnosis'],
      transformResponse: (response: UpdateDiagnosisMutation): UpdateDiagnosis =>
        response.updateDiagnosis.diagnosis,
    },
    destroyDiagnosis: {
      invalidatesTags: ['Diagnosis'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesQuery,
  useGetDiagnosesQuery,
  useGetDiagnosisQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useDestroyDiagnosisMutation,
} = diagnosisApi
