/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
  GetUserQuery,
  api as generatedUserApi,
} from '../generated/user.generated'

type Definitions = DefinitionsFromApi<typeof generatedUserApi>

type Q1Definition = OverrideResultType<Definitions['getUser'], GetUserQuery>

type UpdatedDefinitions = Omit<Definitions, 'getUser'> & {
  getUser: Q1Definition
}

const userApi = generatedUserApi.enhanceEndpoints<string, UpdatedDefinitions>({
  addTagTypes: ['User'],
  endpoints: {
    getUsers: {
      providesTags: ['User'],
      transformResponse: response => response.getUsers,
    },
    getUser: {
      providesTags: ['User'],
      transformResponse: (response: GetUserQuery): GetUserQuery['getUser'] =>
        response.getUser,
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
