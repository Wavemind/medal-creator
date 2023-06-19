/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getDrugsDocument = gql`
  query (
    $projectId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $searchTerm: String
  ) {
    getDrugs(
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
          isAntibiotic
          isAntiMalarial
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

export const destroyDrugDocument = gql`
  mutation ($id: ID!) {
    destroyDrug(input: { id: $id }) {
      id
    }
  }
`

export const createDrugDocument = gql`
  mutation (
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput
    $isNeonat: Boolean!
    $isAntibiotic: Boolean!
    $isAntiMalarial: Boolean!
    $levelOfUrgency: Int
    $formulationsAttributes: [FormulationInput!]!
    $projectId: ID
  ) {
    createDrug(
      input: {
        params: {
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          isNeonat: $isNeonat
          isAntibiotic: $isAntibiotic
          isAntiMalarial: $isAntiMalarial
          levelOfUrgency: $levelOfUrgency
          formulationsAttributes: $formulationsAttributes
          projectId: $projectId
        }
      }
    ) {
      drug {
        id
      }
    }
  }
`
