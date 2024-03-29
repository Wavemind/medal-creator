/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetAlgorithmsQuery,
  GetAlgorithmQuery,
  api as generatedAlgorithmApi,
  GetAlgorithmOrderingQuery,
  ExportDataQuery,
  GetAlgorithmMedalDataConfigQuery,
  PublishAlgorithmMutation,
} from '../generated/algorithm.generated'

type Definitions = DefinitionsFromApi<typeof generatedAlgorithmApi>

type GetAlgorithms = GetAlgorithmsQuery['getAlgorithms']
export type GetAlgorithm = GetAlgorithmQuery['getAlgorithm']
type GetAlgorithmOrdering = GetAlgorithmOrderingQuery['getAlgorithm']
export type GetAlgorithmMedalDataConfig =
  GetAlgorithmMedalDataConfigQuery['getAlgorithm']
type ExportData = ExportDataQuery['exportData']
export type PublishAlgorithm = PublishAlgorithmMutation['publishAlgorithm']

type UpdatedDefinitions = {
  getAlgorithms: OverrideResultType<Definitions['getAlgorithms'], GetAlgorithms>
  getAlgorithm: OverrideResultType<Definitions['getAlgorithm'], GetAlgorithm>
  getAlgorithmOrdering: OverrideResultType<
    Definitions['getAlgorithmOrdering'],
    GetAlgorithmOrdering
  >
  getAlgorithmMedalDataConfig: OverrideResultType<
    Definitions['getAlgorithmMedalDataConfig'],
    GetAlgorithmMedalDataConfig
  >
  exportData: OverrideResultType<Definitions['exportData'], ExportData>
  publishAlgorithm: OverrideResultType<
    Definitions['publishAlgorithm'],
    PublishAlgorithm
  >
}

const algorithmApi = generatedAlgorithmApi.enhanceEndpoints<
  'Algorithm',
  UpdatedDefinitions
>({
  endpoints: {
    getAlgorithms: {
      providesTags: ['Algorithm'],
      transformResponse: (response: GetAlgorithmsQuery): GetAlgorithms =>
        response.getAlgorithms,
    },
    getAlgorithmOrdering: {
      providesTags: ['Algorithm'],
      transformResponse: (
        response: GetAlgorithmOrderingQuery
      ): GetAlgorithmOrdering => response.getAlgorithm,
    },
    getAlgorithmMedalDataConfig: {
      providesTags: ['Algorithm'],
      transformResponse: (
        response: GetAlgorithmMedalDataConfigQuery
      ): GetAlgorithmMedalDataConfig => response.getAlgorithm,
    },
    getAlgorithm: {
      providesTags: ['Algorithm'],
      transformResponse: (response: GetAlgorithmQuery): GetAlgorithm =>
        response.getAlgorithm,
    },
    exportData: {
      providesTags: ['ExportData'],
      transformResponse: (response: ExportDataQuery): ExportData =>
        response.exportData,
    },
    createAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
    updateAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
    destroyAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
    publishAlgorithm: {
      invalidatesTags: ['Algorithm'],
      transformResponse: (
        response: PublishAlgorithmMutation
      ): PublishAlgorithm => response.publishAlgorithm,
    },
    duplicateAlgorithm: {
      invalidatesTags: ['Algorithm'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyExportDataQuery,
  useGetAlgorithmQuery,
  useGetAlgorithmMedalDataConfigQuery,
  useGetAlgorithmOrderingQuery,
  useGetAlgorithmsQuery,
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
  useImportTranslationsMutation,
  usePublishAlgorithmMutation,
  useDuplicateAlgorithmMutation,
} = algorithmApi

// Export endpoints for use in SSR
export const {
  getAlgorithm,
  getAlgorithms,
  getAlgorithmOrdering,
  getAlgorithmMedalDataConfig,
} = algorithmApi.endpoints
