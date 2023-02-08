/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDiagnosesQuery from './getDiagnoses'
import getDiagnosisQuery from './getDiagnosis'
import destroyDiagnosisMutation from './destroyDiagnosis'

export const diagnosesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnoses: getDiagnosesQuery(build),
    getDiagnosis: getDiagnosisQuery(build),
    destroyDiagnosis: destroyDiagnosisMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesQuery,
  useGetDiagnosisQuery,
  useDestroyDiagnosisMutation,
} = diagnosesApi
