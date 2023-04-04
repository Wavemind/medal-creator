/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getDecisionTreeDocument = gql`
query ($id: ID!) {
  getDecisionTree(id: $id) {
   labelTranslations {
     ${HSTORE_LANGUAGES}
   }
   node {
     id
   }
   cutOffStart
   cutOffEnd
   }
 }
`

export const getDecisionTreesDocument = gql`
query (
  $algorithmId: ID!
  $after: String
  $before: String
  $first: Int
  $last: Int
  $searchTerm: String
) {
  getDecisionTrees(
    algorithmId: $algorithmId
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
        node {
          labelTranslations {
            ${HSTORE_LANGUAGES}
          }
        }
      }
    }
  }
}
`

export const createDecisionTreeDocument = gql`
  mutation (
    $algorithmId: ID!
    $labelTranslations: HstoreInput!
    $nodeId: ID!
    $cutOffStart: Int
    $cutOffEnd: Int
    $cutOffValueType: String
  ) {
    createDecisionTree(
      input: {
        params: {
          algorithmId: $algorithmId
          labelTranslations: $labelTranslations
          nodeId: $nodeId
          cutOffStart: $cutOffStart
          cutOffEnd: $cutOffEnd
          cutOffValueType: $cutOffValueType
        }
      }
    ) {
      decisionTree {
        id
      }
    }
  }
`

export const updateDecisionTreeDocument = gql`
  mutation (
    $id: ID!
    $labelTranslations: HstoreInput!
    $nodeId: ID!
    $cutOffStart: Int
    $cutOffEnd: Int
    $cutOffValueType: String
  ) {
    updateDecisionTree(
      input: {
        params: {
          id: $id
          labelTranslations: $labelTranslations
          nodeId: $nodeId
          cutOffStart: $cutOffStart
          cutOffEnd: $cutOffEnd
          cutOffValueType: $cutOffValueType
        }
      }
    ) {
      decisionTree {
        id
      }
    }
  }
`

export const destroyDecisionTreeDocument = gql`
  mutation ($id: ID!) {
    destroyDecisionTree(input: { id: $id }) {
      id
    }
  }
`

export const duplicateDecisionTreeDocument = gql`
  mutation ($id: ID!) {
    duplicateDecisionTree(input: { id: $id }) {
      id
    }
  }
`
