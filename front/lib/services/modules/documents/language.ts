/**
 * The external imports
 */
import { gql } from 'graphql-request'

export const getLanguagesDocument = gql`
  query {
    getLanguages {
      id
      code
      name
    }
  }
`
