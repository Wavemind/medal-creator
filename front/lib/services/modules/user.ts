/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePagination from '@/lib/utils/calculatePagination'
import { apiGraphql } from '../apiGraphql'
import createUserMutation from './user/createUser'
// import getUserQuery from './user/getUser'
// import getUsersQuery from './user/getUsers'
import updateUserMutation from './user/updateUser'
import updatePasswordMutation from './user/updatePassword'
import acceptInvitationMutation from './user/acceptInvitation'
import lockUserMutation from './user/lockUser'
import unlockUserMutation from './user/unlockUser'
import { getUserQueryString, getUsersQueryString } from './queries/user'
import type { Paginated, PaginationInput } from '@/types/common'
import type { User } from '@/types/user'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getUser: build.query<User, { id: number }>({
      query: id => ({
        document: gql`
          ${getUserQueryString}
        `,
        variables: {
          id,
        },
      }),
      transformResponse: (response: { getUser: User }) => response.getUser,
      providesTags: ['User'],
    }),
    getUsers: build.query<Paginated<User>, PaginationInput>({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: gql`
            ${getUsersQueryString}
          `,
          variables: {
            projectId,
            after: endCursor,
            before: startCursor,
            searchTerm: search,
            ...calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: { getUsers: Paginated<User> }) =>
        response.getUsers,
      providesTags: ['User'],
    }),
    createUser: createUserMutation(build),
    updateUser: updateUserMutation(build),
    updatePassword: updatePasswordMutation(build),
    acceptInvitation: acceptInvitationMutation(build),
    lockUser: lockUserMutation(build),
    unlockUser: unlockUserMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetUserQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useAcceptInvitationMutation,
  useLockUserMutation,
  useUnlockUserMutation,
} = userApi

// Export endpoints for use in SSR
export const { getUser, getUsers } = userApi.endpoints
