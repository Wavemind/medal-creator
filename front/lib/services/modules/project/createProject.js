/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
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
      `,
      variables: {
        name: values.name,
        description: values.description,
        villages: values.villages,
        consentManagement: values.consentManagement,
        trackReferral: values.trackReferral,
        languageId: values.languageId,
        emergencyContentTranslations: values.emergencyContentTranslations,
        studyDescriptionTranslations: values.studyDescriptionTranslations,
        userProjectsAttributes: values.userProjectsAttributes,
      },
    }),
    transformResponse: response => response.createProject.project,
    invalidatesTags: ['Project'],
  })
