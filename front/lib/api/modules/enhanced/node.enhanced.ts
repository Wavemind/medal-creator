/**
 * The external imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetComplaintCategoriesQuery,
  api as generatedNodeApi,
} from '../generated/node.generated'

type Definitions = DefinitionsFromApi<typeof generatedNodeApi>

export type GetComplaintCategories =
  GetComplaintCategoriesQuery['getComplaintCategories']

type UpdatedDefinitions = Omit<Definitions, 'getNodes'> & {
  getComplaintCategories: OverrideResultType<
    Definitions['getComplaintCategories'],
    GetComplaintCategories
  >
}

export const nodeApi = generatedNodeApi.enhanceEndpoints<
  'Node',
  UpdatedDefinitions
>({
  endpoints: {
    getComplaintCategories: {
      providesTags: ['Node'],
      transformResponse: (
        response: GetComplaintCategoriesQuery
      ): GetComplaintCategories => response.getComplaintCategories,
    },
  },
})

export const { useGetComplaintCategoriesQuery } = nodeApi

// Export endpoints for use in SSR
export const { getComplaintCategories } = nodeApi.endpoints
