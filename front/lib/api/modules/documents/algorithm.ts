/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getAlgorithmDocument = gql`
query ($id: ID!) {
  getAlgorithm(id: $id) {
     id
     name
     minimumAge
     ageLimit
     mode
     descriptionTranslations {
       ${HSTORE_LANGUAGES}
     }
     ageLimitMessageTranslations {
       ${HSTORE_LANGUAGES}
     }
     languages {
       id
       name
       code
     }
   }
 }
`

export const getAlgorithmsDocument = gql`
  query (
    $projectId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $searchTerm: String
  ) {
    getAlgorithms(
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
          name
          mode
          status
          updatedAt
        }
      }
    }
  }
`

export const createAlgorithmDocument = gql`
  mutation (
    $projectId: ID!
    $name: String!
    $descriptionTranslations: HstoreInput!
    $mode: String!
    $ageLimit: Int!
    $ageLimitMessageTranslations: HstoreInput!
    $minimumAge: Int!
    $languageIds: [ID!]
  ) {
    createAlgorithm(
      input: {
        params: {
          projectId: $projectId
          name: $name
          descriptionTranslations: $descriptionTranslations
          mode: $mode
          ageLimit: $ageLimit
          ageLimitMessageTranslations: $ageLimitMessageTranslations
          minimumAge: $minimumAge
          languageIds: $languageIds
        }
      }
    ) {
      algorithm {
        id
      }
    }
  }
`

export const updateAlgorithmDocument = gql`
  mutation (
    $id: ID!
    $name: String
    $descriptionTranslations: HstoreInput
    $mode: String
    $ageLimit: Int
    $ageLimitMessageTranslations: HstoreInput
    $minimumAge: Int
    $languageIds: [ID!]
    $fullOrderJson: JSON
  ) {
    updateAlgorithm(
      input: {
        params: {
          id: $id
          name: $name
          descriptionTranslations: $descriptionTranslations
          mode: $mode
          ageLimit: $ageLimit
          ageLimitMessageTranslations: $ageLimitMessageTranslations
          minimumAge: $minimumAge
          languageIds: $languageIds
          fullOrderJson: $fullOrderJson
        }
      }
    ) {
      algorithm {
        id
      }
    }
  }
`

export const destroyAlgorithmDocument = gql`
  mutation ($id: ID!) {
    destroyAlgorithm(input: { id: $id }) {
      id
    }
  }
`
