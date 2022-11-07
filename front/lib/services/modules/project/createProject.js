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
          $languageId: ID!
          $emergencyContentTranslations: HstoreInput!
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
                userProjectsAttributes: $userProjectsAttributes
              }
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
        consentManagement: values.consentManagement,
        trackReferral: values.trackReferral,
        languageId: values.languageId,
        emergencyContentTranslations: values.emergencyContentTranslations,
        userProjectsAttributes: values.userProjectsAttributes,
      },
    }),
    transformResponse: response => response.createProject,
    invalidatesTags: ['Project'],
  })
