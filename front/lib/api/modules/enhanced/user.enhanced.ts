/**
 * The internal imports
 */
import { api as generatedUserApi } from '../generated/user.generated'

const userApi = generatedUserApi.enhanceEndpoints({
  addTagTypes: ['User'],
  endpoints: {
    getUsers: {
      providesTags: ['User'],
      transformResponse: response => response.getUsers
    },
    getUser: {
      providesTags: ['User'],
      transformResponse: response => response.getUser,
    },
    createUser: {
      invalidatesTags: ['User'],
      transformResponse: response => response.createUser.user,
    },
    updateUser: {
      invalidatesTags: ['User'],
      transformResponse: response => response.updateUser.user,
    },
    updatePassword: {
      invalidatesTags: ['User'],
      transformResponse: response => response.updateUser.user,
    },
    acceptInvitation: {
      invalidatesTags: ['User'],
    },
    lockUser: {
      invalidatesTags: ['User'],
    },
    unlockUser: {
      invalidatesTags: ['User'],
    },
  },
})

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useAcceptInvitationMutation,
  useLockUserMutation,
  useUnlockUserMutation,
} = userApi

// Export endpoints for use in SSR
export const { getUser, getUsers } = userApi.endpoints
