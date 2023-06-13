/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getManagementDocument = gql`
query ($id: ID!) {
  getManagement(id: $id) {
    id
    descriptionTranslations {
      ${HSTORE_LANGUAGES}
    }
    labelTranslations {
      ${HSTORE_LANGUAGES}
    }
    isNeonat
    isReferral
    levelOfUrgency
    isDefault
    hasInstances
    files {
      id
      name
      size
      url
      extension
    }
  }
}
`

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

export const createManagementDocument = gql`
  mutation (
    $projectId: ID!
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput!
    $levelOfUrgency: Int
    $isNeonat: Boolean
    $isReferral: Boolean
    $filesToAdd: [Upload!]
  ) {
    createManagement(
      input: {
        params: {
          projectId: $projectId
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          levelOfUrgency: $levelOfUrgency
          isNeonat: $isNeonat
          isReferral: $isReferral
        }
        files: $filesToAdd
      }
    ) {
      management {
        id
      }
    }
  }
`

export const updateManagementDocument = gql`
  mutation (
    $id: ID!
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput!
    $levelOfUrgency: Int
    $isNeonat: Boolean
    $isReferral: Boolean
    $filesToAdd: [Upload!]
    $existingFilesToRemove: [Int!]
  ) {
    updateManagement(
      input: {
        params: {
          id: $id
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          levelOfUrgency: $levelOfUrgency
          isNeonat: $isNeonat
          isReferral: $isReferral
        }
        filesToAdd: $filesToAdd
        existingFilesToRemove: $existingFilesToRemove
      }
    ) {
      management {
        id
      }
    }
  }
`

export const destroyManagementDocument = gql`
  mutation ($id: ID!) {
    destroyManagement(input: { id: $id }) {
      id
    }
  }
`
