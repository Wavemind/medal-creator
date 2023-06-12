/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getManagementsDocument = gql`
  query (
    $projectId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $searchTerm: String
  ) {
    getManagements(
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
          isDefault
          hasInstances
          labelTranslations {
            ${HSTORE_LANGUAGES}
          }
        }
      }
    }
  }
`
