/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import createUserMutation from './createUser'
import getUserQuery from './getUser'
import getUsersQuery from './getUsers'
import updateUserMutation from './updateUser'
import updatePasswordMutation from './updatePassword'
import acceptInvitationMutation from './acceptInvitation'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getUser: getUserQuery(build),
    getUsers: getUsersQuery(build),
    createUser: createUserMutation(build),
    updateUser: updateUserMutation(build),
    updatePassword: updatePasswordMutation(build),
    acceptInvitation: acceptInvitationMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetUserQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useAcceptInvitationMutation,
} = userApi

// Export endpoints for use in SSR
export const { getUser, getUsers } = userApi.endpoints
