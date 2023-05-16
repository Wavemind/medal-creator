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
          hasInstances
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

export const createVariableDocument = gql`
  mutation (
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput
    $answersAttributes: [AnswerInput!]
    $nodeComplaintCategoriesAttributes: [NodeComplaintCategoryInput!]
    $answerType: ID
    $type: String
    $projectId: ID
    $system: SystemEnum
    $formula: String
    $round: RoundEnum
    $isMandatory: Boolean
    $isUnavailable: Boolean
    $isEstimable: Boolean
    $isNeonat: Boolean
    $isIdentifiable: Boolean
    $isPreFill: Boolean
    $emergencyStatus: EmergencyStatusEnum
    $minValueWarning: Int
    $maxValueWarning: Int
    $minValueError: Int
    $maxValueError: Int
    $minMessageErrorTranslations: HstoreInput
    $maxMessageErrorTranslations: HstoreInput
    $minMessageWarningTranslations: HstoreInput
    $maxMessageWarningTranslations: HstoreInput
    $placeholderTranslations: HstoreInput
    $filesToAdd: [Upload!]
  ) {
    createVariable(
      input: {
        params: {
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          answersAttributes: $answersAttributes
          nodeComplaintCategoriesAttributes: $nodeComplaintCategoriesAttributes
          answerTypeId: $answerType
          type: $type
          projectId: $projectId
          system: $system
          formula: $formula
          round: $round
          isMandatory: $isMandatory
          isUnavailable: $isUnavailable
          isEstimable: $isEstimable
          isNeonat: $isNeonat
          isIdentifiable: $isIdentifiable
          isPreFill: $isPreFill
          emergencyStatus: $emergencyStatus
          minValueWarning: $minValueWarning
          maxValueWarning: $maxValueWarning
          minValueError: $minValueError
          maxValueError: $maxValueError
          minMessageErrorTranslations: $minMessageErrorTranslations
          maxMessageErrorTranslations: $maxMessageErrorTranslations
          minMessageWarningTranslations: $minMessageWarningTranslations
          maxMessageWarningTranslations: $maxMessageWarningTranslations
          placeholderTranslations: $placeholderTranslations
        }
        files: $filesToAdd
      }
    ) {
      variable {
        id
      }
    }
  }
`

export const getVariableDocument = gql`
  query ($id: ID!) {
    getVariable(id: $id) {
      id
      isMandatory
      labelTranslations {
        ${HSTORE_LANGUAGES}
      }
      descriptionTranslations {
        ${HSTORE_LANGUAGES}
      }
      dependenciesByAlgorithm
    }
  }`

export const duplicateVariableDocument = gql`
  mutation ($id: ID!) {
    duplicateVariable(input: { id: $id }) {
      id
    }
  }
`

export const destroyVariableDocument = gql`
  mutation ($id: ID!) {
    destroyVariable(input: { id: $id }) {
      id
    }
  }
`
