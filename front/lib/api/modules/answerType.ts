/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getAnswerTypesDocument } from './documents/answerType'
import type { AnswerType } from '@/types'

export const answerTypesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAnswerTypes: build.query<Array<AnswerType>, void>({
      query: () => ({
        document: getAnswerTypesDocument,
      }),
      transformResponse: (response: { getAnswerTypes: Array<AnswerType> }) =>
        response.getAnswerTypes,
      providesTags: ['AnswerType'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetAnswerTypesQuery } = answerTypesApi
