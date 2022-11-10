/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '/lib/config/constantes'

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
           name
           description
           consentManagement
           trackReferral
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
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
