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
            algorithmsCount
            drugsCount
            questionsCount
            managementsCount
            questionsSequencesCount
            isCurrentUserAdmin
            lastUpdatedDecisionTrees {
              id
              labelTranslations {
                en
                fr
              }
              node {
                id
                labelTranslations {
                  en
                  fr
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
