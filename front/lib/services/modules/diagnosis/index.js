/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDiagnosesQuery from './getDiagnoses'
import getDiagnosisQuery from './getDiagnosis'

export const diagnosesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnoses: getDiagnosesQuery(build),
    getDiagnosis: getDiagnosisQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetDiagnosesQuery, useGetDiagnosisQuery } = diagnosesApi
