/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePagination from '/lib/utils/calculatePagination'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

export default build =>
  build.query({
    query: tableState => {
      const { projectId, endCursor, startCursor } = tableState
      return {
        document: gql`
          query (
            $projectId: ID!
            $after: String
            $before: String
            $first: Int
            $last: Int
          ) {
            getComplaintCategories(
              projectId: $projectId
              after: $after
              before: $before
              first: $first
              last: $last
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
                }
              }
            }
          }
        `,
        variables: {
          projectId,
          after: endCursor,
          before: startCursor,
          ...calculatePagination(tableState),
        },
      }
    },
    transformResponse: response => {
      // Extract node label translations
      return response.getComplaintCategories.edges.map(edge => {
        const mapped = Object.keys(edge.node.labelTranslations).map(key => ({
          [key]: edge.node.labelTranslations[key],
        }))

        // Merge at same level id and languages ex: {id: 52, en: 'Malaria', fr: 'Malaria'}
        return Object.assign(
          {
            id: edge.node.id,
          },
          ...mapped
        )
      })
    },
    providesTags: ['Node'],
  })
