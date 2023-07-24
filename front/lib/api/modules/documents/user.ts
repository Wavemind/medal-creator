/**
 * The external imports
 */
import { gql } from 'graphql-request'

export const getUsersDocument = gql`
  query (
    $projectId: ID
    $after: String
    $before: String
    $first: Int
    $last: Int
    $searchTerm: String
  ) {
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
`

export const getUserDocument = gql`
  query ($id: ID!) {
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
`

export const createUserDocument = gql`
  mutation (
    $firstName: String!
    $lastName: String!
    $email: String!
    $role: RoleEnum!
    $userProjectsAttributes: [UserProjectInput!]
  ) {
    createUser(
      input: {
        params: {
          firstName: $firstName
          lastName: $lastName
          email: $email
          role: $role
          userProjectsAttributes: $userProjectsAttributes
        }
      }
    ) {
      user {
        id
      }
    }
  }
`

export const updateUserDocument = gql`
  mutation (
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $role: RoleEnum
    $userProjectsAttributes: [UserProjectInput!]
  ) {
    updateUser(
      input: {
        params: {
          id: $id
          firstName: $firstName
          lastName: $lastName
          email: $email
          role: $role
          userProjectsAttributes: $userProjectsAttributes
        }
      }
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
`

export const updateUserPasswordDocument = gql`
  mutation ($id: ID!, $password: String!, $passwordConfirmation: String!) {
    updateUser(
      input: {
        params: {
          id: $id
          password: $password
          passwordConfirmation: $passwordConfirmation
        }
      }
    ) {
      user {
        firstName
        lastName
        email
      }
    }
  }
`

export const acceptInvitationDocument = gql`
  mutation (
    $password: String!
    $passwordConfirmation: String!
    $invitationToken: String!
  ) {
    acceptInvitation(
      input: {
        params: {
          password: $password
          passwordConfirmation: $passwordConfirmation
          invitationToken: $invitationToken
        }
      }
    ) {
      user {
        id
      }
    }
  }
`

export const lockUserDocument = gql`
  mutation ($id: ID!) {
    lockUser(input: { id: $id }) {
      user {
        id
      }
    }
  }
`

export const unlockUserDocument = gql`
  mutation ($id: ID!) {
    unlockUser(input: { id: $id }) {
      user {
        id
      }
    }
  }
`
