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

export const createInstanceDocument = gql`
  mutation (
    $nodeId: ID!
    $instanceableId: ID!
    $instanceableType: String!
    $positionX: Int
    $positionY: Int
  ) {
    createInstance(
      input: {
        params: {
          nodeId: $nodeId
          instanceableId: $instanceableId
          instanceableType: $instanceableType
          positionX: $positionX
          positionY: $positionY
        }
      }
    ) {
      instance {
        id
      }
    }
  }
`
