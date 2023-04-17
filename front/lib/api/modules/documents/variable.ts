/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getVariablesDocument = gql`
  query (
    $projectId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $searchTerm: String
  ) {
    getVariables(
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
          isNeonat
          labelTranslations {
            ${HSTORE_LANGUAGES}
          }
          answerType {
            value
          }
          type
        }
      }
    }
  }
`

export const getVariableDocument = gql`
  query ($id: ID!) {
    getVariable(id: $id) {
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
  }`
