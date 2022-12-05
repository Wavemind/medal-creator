/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $projectId: ID!
          $name: String!
          $descriptionTranslations: HstoreInput!
          $mode: Int!
          $ageLimit: Int!
          $ageLimitMessageTranslations: HstoreInput!
          $minimumAge: Int!
          $algorithmLanguagesAttributes: [AlgorithmLanguageInput!]
        ) {
          createAlgorithm(
            input: {
              params: {
                projectId: $projectId
                name: $name
                descriptionTranslations: $descriptionTranslations
                mode: $mode
                ageLimit: $ageLimit
                ageLimitMessageTranslations: $ageLimitMessageTranslations
                minimumAge: $minimumAge
                algorithmLanguagesAttributes: $algorithmLanguagesAttributes
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
    transformResponse: response => response.createAlgorithm.algorithm,
    invalidatesTags: ['Algorithm'],
  })
