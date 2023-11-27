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
  GetManagementsQuery,
  GetManagementQuery,
  api as generatedManagementApi,
  CreateManagementMutation,
  UpdateManagementMutation,
} from '../generated/management.generated'

type Definitions = DefinitionsFromApi<typeof generatedManagementApi>

type GetManagements = GetManagementsQuery['getManagements']

export type GetManagement = GetManagementQuery['getManagement']
type CreateManagement =
  CreateManagementMutation['createManagement']['management']
type UpdateManagement =
  UpdateManagementMutation['updateManagement']['management']

type UpdatedDefinitions = {
  getManagements: OverrideResultType<
    Definitions['getManagements'],
    GetManagements
  >
  getManagement: OverrideResultType<Definitions['getManagement'], GetManagement>
  createManagement: OverrideResultType<
    Definitions['createManagement'],
    CreateManagement
  >
  updateManagement: OverrideResultType<
    Definitions['updateManagement'],
    UpdateManagement
  >
}

const managementApi = generatedManagementApi.enhanceEndpoints<
  'Management',
  UpdatedDefinitions
>({
  endpoints: {
    getManagements: {
      providesTags: ['Management'],
      transformResponse: (response: GetManagementsQuery): GetManagements =>
        response.getManagements,
    },
    getManagement: {
      providesTags: ['Management'],
      transformResponse: (response: GetManagementQuery): GetManagement =>
        response.getManagement,
    },
    createManagement: {
      invalidatesTags: ['Management'],
      transformResponse: (
        response: CreateManagementMutation
      ): CreateManagement => response.createManagement.management,
    },
    updateManagement: {
      invalidatesTags: ['Management'],
      transformResponse: (
        response: UpdateManagementMutation
      ): UpdateManagement => response.updateManagement.management,
    },
    destroyManagement: {
      invalidatesTags: ['Management'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useGetManagementQuery,
  useLazyGetManagementQuery,
  useLazyGetManagementsQuery,
  useCreateManagementMutation,
  useUpdateManagementMutation,
  useDestroyManagementMutation,
} = managementApi
