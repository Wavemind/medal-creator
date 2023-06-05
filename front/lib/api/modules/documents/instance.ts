/**
 * The external imports
 */
import { gql } from 'graphql-request'

export const getInstancesDocument = gql`
  query ($nodeId: ID!, $algorithmId: ID) {
    getInstances(nodeId: $nodeId, algorithmId: $algorithmId) {
      id
      diagramName
      instanceableType
      instanceableId
      diagnosisId
    }
  }
`
