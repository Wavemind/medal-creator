import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type CreateNodeExclusionsMutationVariables = Types.Exact<{
  params: Array<Types.NodeExclusionInput> | Types.NodeExclusionInput;
}>;


export type CreateNodeExclusionsMutation = { createNodeExclusions?: { __typename?: 'CreateNodeExclusionsPayload', nodeExclusions?: Array<{ __typename?: 'NodeExclusion', id: string }> | null } | null };

export type DestroyNodeExclusionMutationVariables = Types.Exact<{
  excludingNodeId: Types.Scalars['ID'];
  excludedNodeId: Types.Scalars['ID'];
}>;


export type DestroyNodeExclusionMutation = { destroyNodeExclusion?: { __typename?: 'DestroyNodeExclusionPayload', id?: string | null } | null };


export const CreateNodeExclusionsDocument = `
    mutation createNodeExclusions($params: [NodeExclusionInput!]!) {
  createNodeExclusions(input: {params: $params}) {
    nodeExclusions {
      id
    }
  }
}
    `;
export const DestroyNodeExclusionDocument = `
    mutation destroyNodeExclusion($excludingNodeId: ID!, $excludedNodeId: ID!) {
  destroyNodeExclusion(
    input: {excludingNodeId: $excludingNodeId, excludedNodeId: $excludedNodeId}
  ) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    createNodeExclusions: build.mutation<CreateNodeExclusionsMutation, CreateNodeExclusionsMutationVariables>({
      query: (variables) => ({ document: CreateNodeExclusionsDocument, variables })
    }),
    destroyNodeExclusion: build.mutation<DestroyNodeExclusionMutation, DestroyNodeExclusionMutationVariables>({
      query: (variables) => ({ document: DestroyNodeExclusionDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


