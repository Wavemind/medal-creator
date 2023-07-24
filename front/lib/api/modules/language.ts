/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getLanguagesDocument } from './documents/language'
import type { Language } from '@/types'

export const languageApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getLanguages: build.query<Language[], void>({
      query: () => ({
        document: getLanguagesDocument,
      }),
      transformResponse: (response: { getLanguages: Language[] }) =>
        response.getLanguages,
      providesTags: ['Language'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetLanguagesQuery } = languageApi

// Export endpoints for use in SSR
export const { getLanguages } = languageApi.endpoints
