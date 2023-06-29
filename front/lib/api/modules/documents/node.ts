/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getComplaintCategoriesDocument = gql`
query (
  $projectId: ID!
  $after: String
  $before: String
  $first: Int
  $last: Int
) {
  getComplaintCategories(
    projectId: $projectId
    after: $after
    before: $before
    first: $first
    last: $last
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
        labelTranslations {
          ${HSTORE_LANGUAGES}
        }
      }
    }
  }
}
`

// TODO: Move it in instance
export const getAvailableNodesDocument = gql`
  query(
    $instanceableId: ID!,
    $instanceableType: String!,
    $searchTerm: String
  ) {
    getAvailableNodes(
      instanceableId: $instanceableId,
      instanceableType: $instanceableType,
      searchTerm: $searchTerm
    ) {
      id
      category
      labelTranslations {
        ${HSTORE_LANGUAGES}
      }
      diagramAnswers {
        id
        labelTranslations {
          ${HSTORE_LANGUAGES}
        }
      }
    }
  }
`
