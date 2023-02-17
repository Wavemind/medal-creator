/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import createDiagnosisMutation from './diagnosis/createDiagnosis'
import updateDiagnosisMutation from './diagnosis/updateDiagnosis'
import getDiagnosesQuery from './diagnosis/getDiagnoses'
// import getDiagnosisQuery from './diagnosis/getDiagnosis'
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
