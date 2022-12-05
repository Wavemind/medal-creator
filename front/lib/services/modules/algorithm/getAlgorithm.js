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
         getAlgorithm(id: $id) {
            id
            name
            minimumAge
            ageLimit
            mode
            descriptionTranslations {
              ${HSTORE_LANGUAGES}
            }
            ageLimitMessageTranslations {
              ${HSTORE_LANGUAGES}
            }
            languages {
              id
              name
              code
            }
          }
        }
     `,
      variables: { id },
    }),
    transformResponse: response => response.getAlgorithm,
    providesTags: ['Algorithm'],
  })
