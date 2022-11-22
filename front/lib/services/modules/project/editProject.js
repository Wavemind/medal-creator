/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '/lib/config/constants'

/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: id => ({
      document: gql`
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
       `,
      variables: { id },
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
