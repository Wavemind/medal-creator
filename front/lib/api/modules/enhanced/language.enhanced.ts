/**
 * The external imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
  TagTypesFromApi,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetLanguagesQuery,
  api as generatedLanguageApi,
} from '../generated/language.generated'

type Definitions = DefinitionsFromApi<typeof generatedLanguageApi>
type TagTypes = TagTypesFromApi<typeof generatedLanguageApi>

type GetLanguages = GetLanguagesQuery['getLanguages']

type UpdatedDefinitions = Omit<Definitions, 'getLanguages'> & {
  getLanguages: OverrideResultType<Definitions['getLanguages'], GetLanguages>
}

export const languageApi = generatedLanguageApi.enhanceEndpoints<
  TagTypes,
  UpdatedDefinitions
>({
  endpoints: {
    getLanguages: {
      providesTags: ['Language'],
      transformResponse: (response: GetLanguagesQuery): GetLanguages =>
        response.getLanguages,
    },
  },
})

export const { useGetLanguagesQuery } = languageApi

// Export endpoints for use in SSR
export const { getLanguages } = languageApi.endpoints
