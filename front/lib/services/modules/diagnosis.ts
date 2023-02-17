/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import createDiagnosisMutation from './createDiagnosis'
import updateDiagnosisMutation from './updateDiagnosis'
import getDiagnosesQuery from './getDiagnoses'
// import getDiagnosisQuery from './getDiagnosis'
import { getDiagnosisDocument } from './documents/diagnosis'
import type { Diagnosis } from '@/types/diagnosis'

export const diagnosesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnosis: build.query<Diagnosis, string>({
      query: id => ({
        document: getDiagnosisDocument,
        variables: { id },
      }),
      transformResponse: (response: { getDiagnosis: Diagnosis }) =>
        response.getDiagnosis,
      providesTags: ['Diagnosis'],
    }),
    getDiagnoses: getDiagnosesQuery(build),
    createDiagnosis: createDiagnosisMutation(build),
    updateDiagnosis: updateDiagnosisMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesQuery,
  useGetDiagnosisQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
} = diagnosesApi
