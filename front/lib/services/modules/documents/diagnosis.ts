/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getDiagnosisDocument = gql`
query ($id: ID!) {
  getDiagnosis(id: $id) {
     id
     descriptionTranslations {
       ${HSTORE_LANGUAGES}
     }
     labelTranslations {
       ${HSTORE_LANGUAGES}
     }
     levelOfUrgency
   }
 }
`

export const getDiagnosesDocument = gql`
query (
  $algorithmId: ID!
  $decisionTreeId: ID
  $after: String
  $before: String
  $first: Int
  $last: Int
  $searchTerm: String
) {
  getDiagnoses(
    algorithmId: $algorithmId
    decisionTreeId: $decisionTreeId
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
        labelTranslations {
          ${HSTORE_LANGUAGES}
        }
        descriptionTranslations {
          ${HSTORE_LANGUAGES}
        }
        levelOfUrgency
      }
    }
  }
}
`

export const createDiagnosisDocument = gql`
  mutation (
    $decisionTreeId: ID!
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput!
    $levelOfUrgency: Int
  ) {
    createDiagnosis(
      input: {
        params: {
          decisionTreeId: $decisionTreeId
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          levelOfUrgency: $levelOfUrgency
        }
      }
    ) {
      diagnosis {
        id
      }
    }
  }
`

export const updateDiagnosisDocument = gql`
  mutation (
    $id: ID!
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput!
    $levelOfUrgency: Int
  ) {
    updateDiagnosis(
      input: {
        params: {
          id: $id
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          levelOfUrgency: $levelOfUrgency
        }
      }
    ) {
      diagnosis {
        id
      }
    }
  }
`
