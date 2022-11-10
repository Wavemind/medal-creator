/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: id => ({
      document: gql`
       query {
         getProject(id: ${id}) {
           id
           description
           consentManagement
           trackReferral
           languageId
           emergencyContentTranslations
           studyDescriptionTranslations
           userProjectsAttributes {
            userId
            isAdmin
           }
         }
       }
       `,
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
