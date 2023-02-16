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
         getDecisionTree(id: $id) {
          labelTranslations {
            ${HSTORE_LANGUAGES}
          }
          node {
            id
          }
          cutOffStart
          cutOffEnd
          }
        }
     `,
      variables: { id },
    }),
    transformResponse: response => response.getDecisionTree,
    providesTags: ['DecisionTree'],
  })
