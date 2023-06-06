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
  GetUserQuery,
  GetUsersQuery,
  api as generatedUserApi,
} from '../generated/user.generated'

type Definitions = DefinitionsFromApi<typeof generatedUserApi>

export type GetUsers = GetUsersQuery['getUsers']
type GetUser = GetUserQuery['getUser']

type UpdatedDefinitions = Omit<Definitions, 'getUsers' | 'getUser'> & {
  getUsers: OverrideResultType<Definitions['getUsers'], GetUsers>
  getUser: OverrideResultType<Definitions['getUser'], GetUser>
}

const userApi = generatedUserApi.enhanceEndpoints<'User', UpdatedDefinitions>({
  endpoints: {
    getUsers: {
      providesTags: ['User'],
      transformResponse: (response: GetUsersQuery): GetUsers =>
        response.getUsers,
    },
    getUser: {
      providesTags: ['User'],
      transformResponse: (response: GetUserQuery): GetUser => response.getUser,
    },
    createUser: {
      invalidatesTags: ['User'],
    },
    updateUser: {
      invalidatesTags: ['User'],
    },
    updatePassword: {
      invalidatesTags: ['User'],
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
