/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getUserQuery from './getUser'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getUser: getUserQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetUserQuery,
  util: { getRunningOperationPromises },
} = userApi

// Export endpoints for use in SSR
export const { getUser } = userApi.endpoints
