/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '/lib/config/constants'

export default build =>
  build.query({
    query: id => ({
      document: gql`
       query ($id: ID!) {
         getDiagnosis(id: $id) {
            id
            descriptionTranslations {
              ${HSTORE_LANGUAGES}
            }
            labelTranslations {
              ${HSTORE_LANGUAGES}
            }

          }
        }
     `,
      variables: { id },
    }),
    transformResponse: response => response.getDiagnosis,
    providesTags: ['Diagnosis'],
  })
