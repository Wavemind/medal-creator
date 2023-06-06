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
          isDefault
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
    $answersAttributes: [AnswerInput!]!
    $complaintCategoryIds: [ID!]
    $answerType: ID!
    $type: String!
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
          complaintCategoryIds: $complaintCategoryIds
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

export const editVariableDocument = gql`
  query ($id: ID!) {
    getVariable(id: $id) {
      labelTranslations {
        ${HSTORE_LANGUAGES}
      }
      descriptionTranslations {
        ${HSTORE_LANGUAGES}
      }
      answers {
        id
        labelTranslations {
          ${HSTORE_LANGUAGES}
        }
        operator
        value
      }
      nodeComplaintCategories {
        complaintCategory {
          id
          labelTranslations {
            ${HSTORE_LANGUAGES}
          }
        }
      }
      answerType {
        id
      }
      hasInstances
      type
      system
      formula
      round
      isMandatory
      isUnavailable
      isEstimable
      isNeonat
      isIdentifiable
      isPreFill
      emergencyStatus
      minValueWarning
      maxValueWarning
      minValueError
      maxValueError
      minMessageErrorTranslations {
        ${HSTORE_LANGUAGES}
      }
      maxMessageErrorTranslations {
        ${HSTORE_LANGUAGES}
      }
      minMessageWarningTranslations {
        ${HSTORE_LANGUAGES}
      }
      maxMessageWarningTranslations {
        ${HSTORE_LANGUAGES}
      }
      placeholderTranslations {
        ${HSTORE_LANGUAGES}
      }
      files {
        id
        name
        size
        url
        extension
      }
    }
  }`

export const updateVariableDocument = gql`
  mutation (
    $id: ID!
    $labelTranslations: HstoreInput!
    $descriptionTranslations: HstoreInput
    $answersAttributes: [AnswerInput!]!
    $complaintCategoryIds: [ID!]
    $answerType: ID!
    $type: String!
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
    $existingFilesToRemove: [Int!]
  ) {
    updateVariable(
      input: {
        params: {
          id: $id
          labelTranslations: $labelTranslations
          descriptionTranslations: $descriptionTranslations
          answersAttributes: $answersAttributes
          complaintCategoryIds: $complaintCategoryIds
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
        filesToAdd: $filesToAdd
        existingFilesToRemove: $existingFilesToRemove
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
}
`

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
