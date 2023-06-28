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
  GetAdministrationRoutesQuery,
  api as generatedAdministrationRouteApi,
} from '../generated/administrationRoute.generated'

type Definitions = DefinitionsFromApi<typeof generatedAdministrationRouteApi>

type GetAdministrationRoutes =
  GetAdministrationRoutesQuery['getAdministrationRoutes']

type UpdatedDefinitions = {
  getAdministrationRoutes: OverrideResultType<
    Definitions['getAdministrationRoutes'],
    GetAdministrationRoutes
  >
}

const administrationRouteApi = generatedAdministrationRouteApi.enhanceEndpoints<
  'AdministrationRoute',
  UpdatedDefinitions
>({
  endpoints: {
    getAdministrationRoutes: {
      providesTags: ['AdministrationRoute'],
      transformResponse: (
        response: GetAdministrationRoutesQuery
      ): GetAdministrationRoutes => response.getAdministrationRoutes,
    },
  },
})

// Export hooks for usage in functional components
export const { useGetAdministrationRoutesQuery } = administrationRouteApi
