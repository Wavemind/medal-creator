/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getUserQuery from './getUser'
import getUsersQuery from './getUsers'
import updateUserMutation from './updateUser'
import updatePasswordMutation from './updatePassword'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getUser: getUserQuery(build),
    getUsers: getUsersQuery(build),
    updateUser: updateUserMutation(build),
    updatePassword: updatePasswordMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  util: { getRunningOperationPromises },
} = userApi

// Export endpoints for use in SSR
export const { getUser, getUsers } = userApi.endpoints
