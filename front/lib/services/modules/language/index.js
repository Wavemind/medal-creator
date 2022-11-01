/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getLanguagesQuery from './getLanguages'

export const languageApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getLanguages: getLanguagesQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetLanguagesQuery,
  util: { getRunningOperationPromises },
} = languageApi

// Export endpoints for use in SSR
export const { getLanguages } = languageApi.endpoints
