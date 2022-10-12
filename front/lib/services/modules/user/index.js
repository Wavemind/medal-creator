/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getUserQuery from './getUser'
import updateUserMutation from './updateUser'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getUser: getUserQuery(build),
    updateUser: updateUserMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetUserQuery,
  useUpdateUserMutation,
  util: { getRunningOperationPromises },
} = userApi

// Export endpoints for use in SSR
export const { getUser } = userApi.endpoints
