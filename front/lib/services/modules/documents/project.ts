/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getProjectsDocument = gql`
  query ($searchTerm: String) {
    getProjects(searchTerm: $searchTerm) {
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
          isCurrentUserAdmin
        }
      }
    }
  }
`

export const getProjectDocument = gql`
  query ($id: ID!) {
    getProject(id: $id) {
      id
      name
      language {
        code
      }
      isCurrentUserAdmin
    }
  }
`

export const getProjectSummaryDocument = gql`
  query ($id: ID!) {
    getProject(id: $id) {
      id
      algorithmsCount
      drugsCount
      questionsCount
      managementsCount
      questionsSequencesCount
    }
  }
`

export const getLastUpdatedDecisionTreesDocument = gql`
query (
  $projectId: ID!
  $after: String
  $before: String
  $first: Int
  $last: Int
) {
  getLastUpdatedDecisionTrees(
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
        updatedAt
        labelTranslations {
          ${HSTORE_LANGUAGES}
        }
        algorithm {
          name
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

export const editProjectDocument = gql`
query ($id: ID!) {
  getProject(id: $id) {
    id
    name
    description
    consentManagement
    trackReferral
    isCurrentUserAdmin
    language {
     id
    }
    emergencyContentTranslations {
     ${HSTORE_LANGUAGES}
    }
    studyDescriptionTranslations {
     ${HSTORE_LANGUAGES}
    }
    userProjects {
     id
     userId
     isAdmin
    }
  }
}
`

export const createProjectDocument = gql`
  mutation (
    $name: String!
    $description: String!
    $consentManagement: Boolean!
    $trackReferral: Boolean!
    $villages: Upload
    $languageId: ID!
    $emergencyContentTranslations: HstoreInput!
    $studyDescriptionTranslations: HstoreInput!
    $userProjectsAttributes: [UserProjectInput!]
  ) {
    createProject(
      input: {
        params: {
          name: $name
          description: $description
          consentManagement: $consentManagement
          trackReferral: $trackReferral
          languageId: $languageId
          emergencyContentTranslations: $emergencyContentTranslations
          studyDescriptionTranslations: $studyDescriptionTranslations
          userProjectsAttributes: $userProjectsAttributes
        }
        villages: $villages
      }
    ) {
      project {
        id
      }
    }
  }
`

export const updateProjectDocument = gql`
  mutation (
    $id: ID!
    $name: String!
    $description: String!
    $consentManagement: Boolean!
    $trackReferral: Boolean!
    $villages: Upload
    $languageId: ID!
    $emergencyContentTranslations: HstoreInput!
    $studyDescriptionTranslations: HstoreInput!
    $userProjectsAttributes: [UserProjectInput!]
  ) {
    updateProject(
      input: {
        params: {
          id: $id
          name: $name
          description: $description
          consentManagement: $consentManagement
          trackReferral: $trackReferral
          languageId: $languageId
          emergencyContentTranslations: $emergencyContentTranslations
          studyDescriptionTranslations: $studyDescriptionTranslations
          userProjectsAttributes: $userProjectsAttributes
        }
        villages: $villages
      }
    ) {
      project {
        id
      }
    }
  }
`
export const unsubscribeFromProjectDocument = gql`
  mutation ($id: ID!) {
    unsubscribeFromProject(input: { id: $id }) {
      project {
        id
      }
    }
  }
`
