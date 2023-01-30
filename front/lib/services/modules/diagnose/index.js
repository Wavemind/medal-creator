/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getDiagnosesQuery from './getDiagnoses'

export const diagnosesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnoses: getDiagnosesQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useLazyGetDiagnosesQuery } = diagnosesApi
