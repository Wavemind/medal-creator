/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
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
      `,
      variables: values,
    }),
    transformResponse: response => response.updateProject.project,
    invalidatesTags: ['Project'],
  })
