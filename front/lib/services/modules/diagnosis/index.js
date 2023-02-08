/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import createDiagnosisMutation from './createDiagnosis'
import updateDiagnosisMutation from './updateDiagnosis'
import getDiagnosesQuery from './getDiagnoses'
import getDiagnosisQuery from './getDiagnosis'

export const diagnosesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnoses: getDiagnosesQuery(build),
    getDiagnosis: getDiagnosisQuery(build),
    createDiagnosis: createDiagnosisMutation(build),
    updateDiagnosis: updateDiagnosisMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesQuery,
  useGetDiagnosisQuery,
  useLazyGetDiagnosisQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
} = diagnosesApi
