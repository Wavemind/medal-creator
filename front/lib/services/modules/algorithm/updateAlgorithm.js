/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $id: ID!
          $name: String!
          $descriptionTranslations: HstoreInput!
          $mode: String!
          $ageLimit: Int!
          $ageLimitMessageTranslations: HstoreInput!
          $minimumAge: Int!
          $languageIds: [ID!]
        ) {
          updateAlgorithm(
            input: {
              params: {
                id: $id
                name: $name
                descriptionTranslations: $descriptionTranslations
                mode: $mode
                ageLimit: $ageLimit
                ageLimitMessageTranslations: $ageLimitMessageTranslations
                minimumAge: $minimumAge
                languageIds: $languageIds
              }
            }
          ) {
            algorithm {
              id
            }
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.updateAlgorithm.algorithm,
    invalidatesTags: ['Algorithm'],
  })
