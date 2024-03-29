import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type UserFieldsFragment = { id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum };

export type GetUsersQueryVariables = Types.Exact<{
  projectId?: Types.InputMaybe<Types.Scalars['ID']>;
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetUsersQuery = { getUsers: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { lockedAt?: any | null, invitationAcceptedAt?: any | null, invitationCreatedAt?: any | null, id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum } }> } };

export type GetUserQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetUserQuery = { getUser: { id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum, userProjects: Array<{ id: string, projectId: string, isAdmin: boolean, project?: { name: string } | null }> } };

export type CreateUserMutationVariables = Types.Exact<{
  firstName: Types.Scalars['String'];
  lastName: Types.Scalars['String'];
  email: Types.Scalars['String'];
  role: Types.RoleEnum;
  userProjectsAttributes?: Types.InputMaybe<Array<Types.UserProjectInput> | Types.UserProjectInput>;
}>;


export type CreateUserMutation = { createUser?: { user?: { id: string } | null } | null };

export type UpdateUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  firstName: Types.Scalars['String'];
  lastName: Types.Scalars['String'];
  email: Types.Scalars['String'];
  role: Types.RoleEnum;
  userProjectsAttributes?: Types.InputMaybe<Array<Types.UserProjectInput> | Types.UserProjectInput>;
}>;


export type UpdateUserMutation = { updateUser?: { user?: { id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum } | null } | null };

export type UpdatePasswordMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  password: Types.Scalars['String'];
  passwordConfirmation: Types.Scalars['String'];
}>;


export type UpdatePasswordMutation = { updateUser?: { user?: { firstName: string, lastName: string, email: string } | null } | null };

export type AcceptInvitationMutationVariables = Types.Exact<{
  password: Types.Scalars['String'];
  passwordConfirmation: Types.Scalars['String'];
  invitationToken: Types.Scalars['String'];
}>;


export type AcceptInvitationMutation = { acceptInvitation?: { user?: { id: string } | null } | null };

export type LockUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type LockUserMutation = { lockUser?: { user?: { id: string } | null } | null };

export type UnlockUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type UnlockUserMutation = { unlockUser?: { user?: { id: string } | null } | null };

export type ResendInvitationMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ResendInvitationMutation = { resendInvitation?: { user?: { id: string } | null } | null };

export const UserFieldsFragmentDoc = `
    fragment UserFields on User {
  id
  firstName
  lastName
  email
  role
}
    `;
export const GetUsersDocument = `
    query getUsers($projectId: ID, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getUsers(
    projectId: $projectId
    after: $after
    before: $before
    first: $first
    last: $last
    searchTerm: $searchTerm
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    totalCount
    edges {
      node {
        ...UserFields
        lockedAt
        invitationAcceptedAt
        invitationCreatedAt
      }
    }
  }
}
    ${UserFieldsFragmentDoc}`;
export const GetUserDocument = `
    query getUser($id: ID!) {
  getUser(id: $id) {
    ...UserFields
    userProjects {
      id
      projectId
      isAdmin
      project {
        name
      }
    }
  }
}
    ${UserFieldsFragmentDoc}`;
export const CreateUserDocument = `
    mutation createUser($firstName: String!, $lastName: String!, $email: String!, $role: RoleEnum!, $userProjectsAttributes: [UserProjectInput!]) {
  createUser(
    input: {params: {firstName: $firstName, lastName: $lastName, email: $email, role: $role, userProjectsAttributes: $userProjectsAttributes}}
  ) {
    user {
      id
    }
  }
}
    `;
export const UpdateUserDocument = `
    mutation updateUser($id: ID!, $firstName: String!, $lastName: String!, $email: String!, $role: RoleEnum!, $userProjectsAttributes: [UserProjectInput!]) {
  updateUser(
    input: {params: {id: $id, firstName: $firstName, lastName: $lastName, email: $email, role: $role, userProjectsAttributes: $userProjectsAttributes}}
  ) {
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;
export const UpdatePasswordDocument = `
    mutation updatePassword($id: ID!, $password: String!, $passwordConfirmation: String!) {
  updateUser(
    input: {params: {id: $id, password: $password, passwordConfirmation: $passwordConfirmation}}
  ) {
    user {
      firstName
      lastName
      email
    }
  }
}
    `;
export const AcceptInvitationDocument = `
    mutation acceptInvitation($password: String!, $passwordConfirmation: String!, $invitationToken: String!) {
  acceptInvitation(
    input: {params: {password: $password, passwordConfirmation: $passwordConfirmation, invitationToken: $invitationToken}}
  ) {
    user {
      id
    }
  }
}
    `;
export const LockUserDocument = `
    mutation lockUser($id: ID!) {
  lockUser(input: {id: $id}) {
    user {
      id
    }
  }
}
    `;
export const UnlockUserDocument = `
    mutation unlockUser($id: ID!) {
  unlockUser(input: {id: $id}) {
    user {
      id
    }
  }
}
    `;
export const ResendInvitationDocument = `
    mutation resendInvitation($id: ID!) {
  resendInvitation(input: {id: $id}) {
    user {
      id
    }
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<GetUsersQuery, GetUsersQueryVariables | void>({
      query: (variables) => ({ document: GetUsersDocument, variables })
    }),
    getUser: build.query<GetUserQuery, GetUserQueryVariables>({
      query: (variables) => ({ document: GetUserDocument, variables })
    }),
    createUser: build.mutation<CreateUserMutation, CreateUserMutationVariables>({
      query: (variables) => ({ document: CreateUserDocument, variables })
    }),
    updateUser: build.mutation<UpdateUserMutation, UpdateUserMutationVariables>({
      query: (variables) => ({ document: UpdateUserDocument, variables })
    }),
    updatePassword: build.mutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>({
      query: (variables) => ({ document: UpdatePasswordDocument, variables })
    }),
    acceptInvitation: build.mutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>({
      query: (variables) => ({ document: AcceptInvitationDocument, variables })
    }),
    lockUser: build.mutation<LockUserMutation, LockUserMutationVariables>({
      query: (variables) => ({ document: LockUserDocument, variables })
    }),
    unlockUser: build.mutation<UnlockUserMutation, UnlockUserMutationVariables>({
      query: (variables) => ({ document: UnlockUserDocument, variables })
    }),
    resendInvitation: build.mutation<ResendInvitationMutation, ResendInvitationMutationVariables>({
      query: (variables) => ({ document: ResendInvitationDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


