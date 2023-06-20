/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import { getAdministrationRoutesDocument } from './documents/administrationRoute'
import type { AdministrationRoute } from '@/types'

export const administrationRoutesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAdministrationRoutes: build.query<AdministrationRoute[], void>({
      query: () => ({
        document: getAdministrationRoutesDocument,
      }),
      transformResponse: (response: {
        getAdministrationRoutes: AdministrationRoute[]
      }) => response.getAdministrationRoutes,
      providesTags: ['AdministrationRoute'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetAdministrationRoutesQuery } = administrationRoutesApi
