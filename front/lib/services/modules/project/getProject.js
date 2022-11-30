/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '/lib/config/constants'

// TODO : Fix this with new datatable structure. Maybe separate the requests ?
export default build =>
  build.query({
    query: id => ({
      document: gql`
        query ($id: ID!) {
          getProject(id: $id) {
            id
            name
            language {
              code
            }
            isCurrentUserAdmin
            lastUpdatedDecisionTrees {
              id
              labelTranslations {
                ${HSTORE_LANGUAGES}
              }
              node {
                id
                labelTranslations {
                  ${HSTORE_LANGUAGES}
                }
              }
              algorithm {
                id
                name
              }
              updatedAt
            }
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
