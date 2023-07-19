import * as Types from '../../../../types/graphql.d'

import { apiGraphql } from '@/lib/api/apiGraphql'
export type CreateNodeExclusionsMutationVariables = Types.Exact<{
  params: Array<Types.NodeExclusionInput> | Types.NodeExclusionInput
}>

export type CreateNodeExclusionsMutation = {
  createNodeExclusions?: {
    __typename?: 'CreateNodeExclusionsPayload'
    nodeExclusions?: Array<{ __typename?: 'NodeExclusion'; id: string }> | null
  } | null
}

export const CreateNodeExclusionsDocument = `
    mutation createNodeExclusions($params: [NodeExclusionInput!]!) {
  createNodeExclusions(input: {params: $params}) {
    nodeExclusions {
      id
    }
  }
}
    `

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    createNodeExclusions: build.mutation<
      CreateNodeExclusionsMutation,
      CreateNodeExclusionsMutationVariables
    >({
      query: variables => ({
        document: CreateNodeExclusionsDocument,
        variables,
      }),
    }),
  }),
})

export { injectedRtkApi as api }
