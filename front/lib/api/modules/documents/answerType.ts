/**
 * The external imports
 */
import { gql } from 'graphql-request'

export const getAnswerTypesDocument = gql`
  query {
    getAnswerTypes {
      id
      display
      value
    }
  }
`
