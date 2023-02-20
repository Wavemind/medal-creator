/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createDiagnosisDocument,
  getDiagnosesDocument,
  getDiagnosisDocument,
  updateDiagnosisDocument,
} from './documents/diagnosis'
import type { Diagnosis } from '@/types/diagnosis'
import type { Paginated } from '@/types/common'

export const diagnosesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnosis: build.query<Diagnosis, number>({
      query: id => ({
        document: getDiagnosisDocument,
        variables: { id },
      }),
      transformResponse: (response: { getDiagnosis: Diagnosis }) =>
        response.getDiagnosis,
      providesTags: ['Diagnosis'],
    }),
    getDiagnoses: build.query<Paginated<Diagnosis>, { search?: string }>({
      query: ({ search }) => ({
        document: getDiagnosesDocument,
        variables: { searchTerm: search },
      }),
      transformResponse: (response: { getDiagnoses: Paginated<Diagnosis> }) =>
        response.getDiagnoses,
      providesTags: ['Diagnosis'],
    }),
    createDiagnosis: build.mutation<Diagnosis, DiagnosisInputs>({
      query: values => ({
        document: createDiagnosisDocument,
        variables: values,
      }),
      transformResponse: (response: {
        createDiagnosis: { diagnosis: Diagnosis }
      }) => response.createDiagnosis.diagnosis,
      invalidatesTags: ['Diagnosis'],
    }),
    updateDiagnosis: build.mutation<
      Diagnosis,
      Partial<DiagnosisInputs> & Pick<Diagnosis, 'id'>
    >({
      query: values => ({
        document: updateDiagnosisDocument,
        variables: values,
      }),
      transformResponse: (response: {
        updateDiagnosis: { diagnosis: Diagnosis }
      }) => response.updateDiagnosis.diagnosis,
      invalidatesTags: ['Diagnosis'],
    }),
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
