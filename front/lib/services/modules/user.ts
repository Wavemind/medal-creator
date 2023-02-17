/**
 * The internal imports
 */
import calculatePagination from '@/lib/utils/calculatePagination'
import { apiGraphql } from '../apiGraphql'
import {
  acceptInvitationDocument,
  createUserDocument,
  getUserDocument,
  getUsersDocument,
  lockUserDocument,
  unlockUserDocument,
  updateUserDocument,
  updateUserPasswordDocument,
} from './documents/user'
import type { Paginated, PaginatedQueryWithProject } from '@/types/common'
import type { AcceptInvitation, User, UserInputs } from '@/types/user'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getUser: build.query<User, string>({
      query: id => ({
        document: getUserDocument,
        variables: {
          id,
        },
      }),
      transformResponse: (response: { getUser: User }) => response.getUser,
      providesTags: ['User'],
    }),
    getUsers: build.query<Paginated<User>, PaginatedQueryWithProject>({
      query: tableState => {
        const { projectId, endCursor, startCursor, search } = tableState
        return {
          document: getUsersDocument,
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
    createUser: build.mutation<User, UserInputs>({
      query: values => ({
        document: createUserDocument,
        variables: values,
      }),
      transformResponse: (response: { createUser: { user: User } }) =>
        response.createUser.user,
      invalidatesTags: ['User'],
    }),
    updateUser: build.mutation<User, Partial<UserInputs> & { id: string }>({
      query: values => ({
        document: updateUserDocument,
        variables: values,
      }),
      transformResponse: (response: { updateUser: { user: User } }) =>
        response.updateUser.user,
      invalidatesTags: ['User'],
    }),
    updatePassword: build.mutation<User, Partial<UserInputs>>({
      query: values => ({
        document: updateUserPasswordDocument,
        variables: values,
      }),
      transformResponse: (response: { updateUser: { user: User } }) =>
        response.updateUser.user,
      invalidatesTags: ['User'],
    }),
    acceptInvitation: build.mutation<null, AcceptInvitation>({
      query: values => ({
        document: acceptInvitationDocument,
        variables: values,
      }),
      transformResponse: (response: { acceptInvitation: null }) =>
        response.acceptInvitation,
      invalidatesTags: ['User'],
    }),
    lockUser: build.mutation<null, { id: string }>({
      query: id => ({
        document: lockUserDocument,
        variables: { id },
      }),
      transformResponse: (response: { lockUser: null }) => response.lockUser,
      invalidatesTags: ['User'],
    }),
    unlockUser: build.mutation<null, { id: string }>({
      query: id => ({
        document: unlockUserDocument,
        variables: { id },
      }),
      transformResponse: (response: { unlockUser: null }) =>
        response.unlockUser,
      invalidatesTags: ['User'],
    }),
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
