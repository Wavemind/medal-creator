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


export type GetDiagnosesExclusionsQuery = { getDiagnosesExclusions: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, excludingNode: { id: string, fullReference: string, labelTranslations: { en?: string | null, fr?: string | null } }, excludedNode: { id: string, fullReference: string, labelTranslations: { en?: string | null, fr?: string | null } } } }> } };

export type CreateNodeExclusionsMutationVariables = Types.Exact<{
  params: Array<Types.NodeExclusionInput> | Types.NodeExclusionInput;
}>;


export type CreateNodeExclusionsMutation = { createNodeExclusions?: { nodeExclusions?: Array<{ id: string }> | null } | null };

export type DestroyNodeExclusionMutationVariables = Types.Exact<{
  excludingNodeId: Types.Scalars['ID'];
  excludedNodeId: Types.Scalars['ID'];
}>;


export type DestroyNodeExclusionMutation = { destroyNodeExclusion?: { id?: string | null } | null };


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


