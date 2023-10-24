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
} from '../generated/algorithm.generated'

type Definitions = DefinitionsFromApi<typeof generatedAlgorithmApi>

type GetAlgorithms = GetAlgorithmsQuery['getAlgorithms']
export type GetAlgorithm = GetAlgorithmQuery['getAlgorithm']
type GetAlgorithmOrdering = GetAlgorithmOrderingQuery['getAlgorithm']
type ExportData = ExportDataQuery['exportData']

type UpdatedDefinitions = {
  getAlgorithms: OverrideResultType<Definitions['getAlgorithms'], GetAlgorithms>
  getAlgorithm: OverrideResultType<Definitions['getAlgorithm'], GetAlgorithm>
  getAlgorithmOrdering: OverrideResultType<
    Definitions['getAlgorithmOrdering'],
    GetAlgorithmOrdering
  >
  exportData: OverrideResultType<Definitions['exportData'], ExportData>
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
  },
})

// Export hooks for usage in functional components
export const {
  useLazyExportDataQuery,
  useGetAlgorithmQuery,
  useGetAlgorithmOrderingQuery,
  useLazyGetAlgorithmsQuery,
  useCreateAlgorithmMutation,
  useUpdateAlgorithmMutation,
  useDestroyAlgorithmMutation,
  useImportTranslationsMutation,
} = algorithmApi

// Export endpoints for use in SSR
export const { getAlgorithm, getAlgorithmOrdering } = algorithmApi.endpoints
