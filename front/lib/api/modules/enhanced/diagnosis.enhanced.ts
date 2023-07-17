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
  api as generatedDiagnosisApi,
  CreateDiagnosisMutation,
} from '../generated/diagnosis.generated'

type Definitions = DefinitionsFromApi<typeof generatedDiagnosisApi>

type GetDiagnoses = GetDiagnosesQuery['getDiagnoses']
type GetDiagnosis = GetDiagnosisQuery['getDiagnosis']
type CreateDiagnosis = CreateDiagnosisMutation['createDiagnosis']['diagnosis']

type UpdatedDefinitions = {
  getDiagnoses: OverrideResultType<Definitions['getDiagnoses'], GetDiagnoses>
  getDiagnosis: OverrideResultType<Definitions['getDiagnosis'], GetDiagnosis>
  createDiagnosis: OverrideResultType<
    Definitions['createDiagnosis'],
    CreateDiagnosis
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
      invalidatesTags: ['Diagnosis', 'Instance'],
      transformResponse: (response: CreateDiagnosisMutation): CreateDiagnosis =>
        response.createDiagnosis.diagnosis,
    },
    updateDiagnosis: {
      invalidatesTags: ['Diagnosis'],
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
