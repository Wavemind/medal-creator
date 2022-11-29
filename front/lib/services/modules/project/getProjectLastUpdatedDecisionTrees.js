/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePaginationNumberText from '/lib/utils/calculatePaginationNumberText'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

export default build =>
  build.query({
    query: tableState => {
      const { projectId, endCursor, startCursor } = tableState

      const numberText = calculatePaginationNumberText(tableState)

      return {
        document: gql`
        query {
          getProjectLastUpdatedDecisionTrees(
            projectId: ${projectId}, 
            ${numberText},
            after: "${endCursor}",
            before: "${startCursor}",
          ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
            }
            totalCount
            edges {
              node {
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
        }
      `,
      }
    },
    transformResponse: response => response.getProjectLastUpdatedDecisionTrees,
    providesTags: ['Project'],
  })
