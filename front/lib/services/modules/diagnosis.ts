/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createDiagnosisDocument,
  destroyDiagnosisDocument,
  getDiagnosesDocument,
  getDiagnosisDocument,
  updateDiagnosisDocument,
} from './documents/diagnosis'
import type { Diagnosis, DiagnosisQuery, Paginated } from '@/types'

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
    getDiagnoses: build.query<
      Paginated<Diagnosis>,
      { algorithmId: number; decisionTreeId: number }
    >({
      query: ({ algorithmId, decisionTreeId }) => ({
        document: getDiagnosesDocument,
        variables: { algorithmId, decisionTreeId },
      }),
      transformResponse: (response: { getDiagnoses: Paginated<Diagnosis> }) =>
        response.getDiagnoses,
      providesTags: ['Diagnosis'],
    }),
    createDiagnosis: build.mutation<Diagnosis, DiagnosisQuery>({
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
      Partial<DiagnosisQuery> & Pick<Diagnosis, 'id'>
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
    destroyDiagnosis: build.mutation<void, number>({
      query: id => ({
        document: destroyDiagnosisDocument,
        variables: { id },
      }),
      invalidatesTags: ['Diagnosis'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useLazyGetDiagnosesQuery,
  useGetDiagnosesQuery,
  useGetDiagnosisQuery,
  useDestroyDiagnosisMutation,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
} = diagnosesApi
