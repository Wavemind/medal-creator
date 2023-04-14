/**
 * The internal imports
 */
import { api as generatedLanguageApi } from '../generated/language.generated'

export const languageApi = generatedLanguageApi.enhanceEndpoints({
  addTagTypes: ['Language'],
  endpoints: {
    getLanguages: {
      providesTags: ['Language'],
      transformResponse: response => response.getLanguages,
    },
  },
})

export const { useGetLanguagesQuery } = languageApi

// Export endpoints for use in SSR
export const { getLanguages } = languageApi.endpoints
