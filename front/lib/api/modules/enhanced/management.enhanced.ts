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
} from '../generated/management.generated'

type Definitions = DefinitionsFromApi<typeof generatedManagementApi>

type GetManagements = GetManagementsQuery['getManagements']
type GetManagement = GetManagementQuery['getManagement']

type UpdatedDefinitions = {
  getManagements: OverrideResultType<
    Definitions['getManagements'],
    GetManagements
  >
  getManagement: OverrideResultType<Definitions['getManagement'], GetManagement>
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
    },
    updateManagement: {
      invalidatesTags: ['Management'],
    },
    destroyManagement: {
      invalidatesTags: ['Management'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useGetManagementQuery,
  useLazyGetManagementsQuery,
  useCreateManagementMutation,
  useUpdateManagementMutation,
  useDestroyManagementMutation,
} = managementApi
