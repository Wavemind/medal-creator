import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetDiagnosesExclusionsQueryVariables = Types.Exact<{
  algorithmId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetDiagnosesExclusionsQuery = { getDiagnosesExclusions: { __typename?: 'NodeExclusionConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'NodeExclusionEdge', node: { __typename?: 'NodeExclusion', id: string, excludingNode: { __typename?: 'Node', id: string, fullReference: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }, excludedNode: { __typename?: 'Node', id: string, fullReference: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } } }> } };

export type CreateNodeExclusionsMutationVariables = Types.Exact<{
  params: Array<Types.NodeExclusionInput> | Types.NodeExclusionInput;
}>;


export type CreateNodeExclusionsMutation = { createNodeExclusions?: { __typename?: 'CreateNodeExclusionsPayload', nodeExclusions?: Array<{ __typename?: 'NodeExclusion', id: string }> | null } | null };

export type DestroyNodeExclusionMutationVariables = Types.Exact<{
  excludingNodeId: Types.Scalars['ID'];
  excludedNodeId: Types.Scalars['ID'];
}>;


export type DestroyNodeExclusionMutation = { destroyNodeExclusion?: { __typename?: 'DestroyNodeExclusionPayload', id?: string | null } | null };


export const GetDiagnosesExclusionsDocument = `
    query getDiagnosesExclusions($algorithmId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getDiagnosesExclusions(
    algorithmId: $algorithmId
    after: $after
    before: $before
    first: $first
    last: $last
    searchTerm: $searchTerm
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
        excludingNode {
          id
          fullReference
          labelTranslations {
            ...HstoreLanguages
          }
        }
        excludedNode {
          id
          fullReference
          labelTranslations {
            ...HstoreLanguages
          }
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
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
    getDiagnosesExclusions: build.query<GetDiagnosesExclusionsQuery, GetDiagnosesExclusionsQueryVariables>({
      query: (variables) => ({ document: GetDiagnosesExclusionsDocument, variables })
    }),
    createNodeExclusions: build.mutation<CreateNodeExclusionsMutation, CreateNodeExclusionsMutationVariables>({
      query: (variables) => ({ document: CreateNodeExclusionsDocument, variables })
    }),
    destroyNodeExclusion: build.mutation<DestroyNodeExclusionMutation, DestroyNodeExclusionMutationVariables>({
      query: (variables) => ({ document: DestroyNodeExclusionDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


