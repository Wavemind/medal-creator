/**
 * The internal imports
 */
import calculatePagination from '@/lib/utils/calculatePagination'
import { apiGraphql } from '../apiGraphql'
import {
  acceptInvitationDocument,
  createUserDocument,
  getCredentialsDocument,
  getUserDocument,
  getUsersDocument,
  lockUserDocument,
  unlockUserDocument,
  updateUserDocument,
  updateUserPasswordDocument,
} from './documents/user'
import type { Paginated, PaginatedQueryWithProject } from '@/types/common'
import type {
  AcceptInvitation,
  User,
  UserCredentials,
  UserInputs,
} from '@/types/user'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getCredentials: build.query<UserCredentials, number>({
      query: id => ({
        document: getCredentialsDocument,
        variables: {
          id,
        },
      }),
      transformResponse: (response: { getCredentials: UserCredentials }) =>
        response.getCredentials,
      providesTags: ['User'],
    }),
    getUser: build.query<User, number>({
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
    updateUser: build.mutation<User, Partial<UserInputs> & Pick<User, 'id'>>({
      query: values => ({
        document: updateUserDocument,
        variables: values,
      }),
      transformResponse: (response: { updateUser: { user: User } }) =>
        response.updateUser.user,
      invalidatesTags: ['User'],
    }),
    updatePassword: build.mutation<
      User,
      Partial<UserInputs> & Pick<User, 'id'>
    >({
      query: values => ({
        document: updateUserPasswordDocument,
        variables: values,
      }),
      transformResponse: (response: { updateUser: { user: User } }) =>
        response.updateUser.user,
      invalidatesTags: ['User'],
    }),
    acceptInvitation: build.mutation<void, AcceptInvitation>({
      query: values => ({
        document: acceptInvitationDocument,
        variables: values,
      }),
      invalidatesTags: ['User'],
    }),
    lockUser: build.mutation<void, number>({
      query: id => ({
        document: lockUserDocument,
        variables: { id },
      }),
      invalidatesTags: ['User'],
    }),
    unlockUser: build.mutation<void, number>({
      query: id => ({
        document: unlockUserDocument,
        variables: { id },
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetCredentialsQuery,
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
export const { getCredentials, getUser, getUsers } = userApi.endpoints
