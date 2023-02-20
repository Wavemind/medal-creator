/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createAlgorithmDocument,
  destroyAlgorithmDocument,
  getAlgorithmDocument,
  getAlgorithmsDocument,
  updateAlgorithmDocument,
} from './documents/algorithm'
import type { Algorithm, AlgorithmInputs } from '@/types/algorithm'
import type { Paginated } from '@/types/common'

export const algorithmsApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAlgorithm: build.query<Algorithm, number>({
      query: id => ({
        document: getAlgorithmDocument,
        variables: { id },
      }),
      transformResponse: (response: { getAlgorithm: Algorithm }) =>
        response.getAlgorithm,
      providesTags: ['Algorithm'],
    }),
    getAlgorithms: build.query<Paginated<Algorithm>, { search?: string }>({
      query: ({ search }) => ({
        document: getAlgorithmsDocument,
        variables: { searchTerm: search },
      }),
      transformResponse: (response: { getAlgorithms: Paginated<Algorithm> }) =>
        response.getAlgorithms,
      providesTags: ['Algorithm'],
    }),
    createAlgorithm: build.mutation<Algorithm, AlgorithmInputs>({
      query: values => ({
        document: createAlgorithmDocument,
        variables: values,
      }),
      transformResponse: (response: {
        createAlgorithm: { algorithm: Algorithm }
      }) => response.createAlgorithm.algorithm,
      invalidatesTags: ['Algorithm'],
    }),
    updateAlgorithm: build.mutation<
      Algorithm,
      Partial<AlgorithmInputs> & Pick<Algorithm, 'id'>
    >({
      query: values => ({
        document: updateAlgorithmDocument,
        variables: values,
      }),
      transformResponse: (response: {
        updateAlgorithm: { algorithm: Algorithm }
      }) => response.updateAlgorithm.algorithm,
      invalidatesTags: ['Algorithm'],
    }),
    destroyAlgorithm: build.mutation<Algorithm, number>({
      query: id => ({
        document: destroyAlgorithmDocument,
        variables: { id },
      }),
      transformResponse: (response: {
        destroyAlgorithm: { algorithm: Algorithm }
      }) => response.destroyAlgorithm.algorithm,
      invalidatesTags: ['Algorithm'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetAlgorithmQuery,
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
} = algorithmsApi

// Export endpoints for use in SSR
export const { getAlgorithm } = algorithmsApi.endpoints
