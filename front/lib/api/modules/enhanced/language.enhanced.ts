/**
 * The internal imports
 */
import { api as generatedlanguageApi } from '../generated/language.generated'

export const languageApi = generatedlanguageApi.enhanceEndpoints({
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
