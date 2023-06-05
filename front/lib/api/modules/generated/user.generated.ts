import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetUsersQueryVariables = Types.Exact<{
  projectId?: Types.InputMaybe<Types.Scalars['ID']>;
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetUsersQuery = { getUsers: { __typename?: 'UserConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges?: Array<{ __typename?: 'UserEdge', node?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum, lockedAt?: string | null } | null } | null> | null } };

export type GetUserQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetUserQuery = { getUser: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, role: Types.RoleEnum, userProjects: Array<{ __typename?: 'UserProject', id: string, projectId?: string | null, isAdmin?: boolean | null, project?: { __typename?: 'Project', name?: string | null } | null }> } };

export type CreateUserMutationVariables = Types.Exact<{
  firstName: Types.Scalars['String'];
  lastName: Types.Scalars['String'];
  email: Types.Scalars['String'];
  role: Types.Scalars['String'];
  userProjectsAttributes?: Types.InputMaybe<Array<Types.UserProjectInput> | Types.UserProjectInput>;
}>;


export type CreateUserMutation = { createUser?: { __typename?: 'CreateUserPayload', user?: { __typename?: 'User', id: string } | null } | null };

export type UpdateUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  firstName?: Types.InputMaybe<Types.Scalars['String']>;
  lastName?: Types.InputMaybe<Types.Scalars['String']>;
  email?: Types.InputMaybe<Types.Scalars['String']>;
  role?: Types.InputMaybe<Types.Scalars['String']>;
  userProjectsAttributes?: Types.InputMaybe<Array<Types.UserProjectInput> | Types.UserProjectInput>;
}>;


export type UpdateUserMutation = { updateUser?: { __typename?: 'UpdateUserPayload', user?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum } | null } | null };

export type UpdatePasswordMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  password: Types.Scalars['String'];
  passwordConfirmation: Types.Scalars['String'];
}>;


export type UpdatePasswordMutation = { updateUser?: { __typename?: 'UpdateUserPayload', user?: { __typename?: 'User', firstName: string, lastName: string, email: string } | null } | null };

export type AcceptInvitationMutationVariables = Types.Exact<{
  password: Types.Scalars['String'];
  passwordConfirmation: Types.Scalars['String'];
  invitationToken: Types.Scalars['String'];
}>;


export type AcceptInvitationMutation = { acceptInvitation?: { __typename?: 'AcceptInvitationPayload', user?: { __typename?: 'User', id: string } | null } | null };

export type LockUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type LockUserMutation = { lockUser?: { __typename?: 'LockUserPayload', user?: { __typename?: 'User', id: string } | null } | null };

export type UnlockUserMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type UnlockUserMutation = { unlockUser?: { __typename?: 'UnlockUserPayload', user?: { __typename?: 'User', id: string } | null } | null };


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
        id
        firstName
        lastName
        email
        role
        lockedAt
      }
    }
  }
}
    `;
export const GetUserDocument = `
    query getUser($id: ID!) {
  getUser(id: $id) {
    id
    email
    firstName
    lastName
    role
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
    `;
export const CreateUserDocument = `
    mutation createUser($firstName: String!, $lastName: String!, $email: String!, $role: String!, $userProjectsAttributes: [UserProjectInput!]) {
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
    mutation updateUser($id: ID!, $firstName: String, $lastName: String, $email: String, $role: String, $userProjectsAttributes: [UserProjectInput!]) {
  updateUser(
    input: {params: {id: $id, firstName: $firstName, lastName: $lastName, email: $email, role: $role, userProjectsAttributes: $userProjectsAttributes}}
  ) {
    user {
      id
      firstName
      lastName
      email
      role
    }
  }
}
    `;
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
  }),
});

export { injectedRtkApi as api };


