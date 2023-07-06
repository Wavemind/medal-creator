import * as Types from '../../../../types/graphql.d';

import { InstanceFieldsFragmentDoc, ComponentFieldsFragmentDoc, NodeFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetInstancesQueryVariables = Types.Exact<{
  nodeId: Types.Scalars['ID'];
  algorithmId?: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type GetInstancesQuery = { getInstances: Array<{ __typename?: 'Instance', id: string, diagramName?: string | null, instanceableType: string, instanceableId: string, diagnosisId?: string | null }> };

export type CreateInstanceMutationVariables = Types.Exact<{
  nodeId: Types.Scalars['ID'];
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
  positionX?: Types.InputMaybe<Types.Scalars['Float']>;
  positionY?: Types.InputMaybe<Types.Scalars['Float']>;
}>;


export type CreateInstanceMutation = { createInstance: { __typename?: 'CreateInstancePayload', instance: { __typename?: 'Instance', id: string } } };

export type GetComponentsQueryVariables = Types.Exact<{
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
}>;


export type GetComponentsQuery = { getComponents: Array<{ __typename?: 'Instance', id: string, positionX: number, positionY: number, conditions: Array<{ __typename?: 'Condition', id: string, cutOffStart?: number | null, cutOffEnd?: number | null, score?: number | null, answer: { __typename?: 'Answer', id: string, nodeId: string } }>, node: { __typename?: 'Node', id: string, category: string, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } }> };

export type GetAvailableNodesQueryVariables = Types.Exact<{
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetAvailableNodesQuery = { getAvailableNodes: Array<{ __typename?: 'Node', id: string, category: string, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> }> };


export const GetInstancesDocument = `
    query getInstances($nodeId: ID!, $algorithmId: ID) {
  getInstances(nodeId: $nodeId, algorithmId: $algorithmId) {
    ...InstanceFields
  }
}
    ${InstanceFieldsFragmentDoc}`;
export const CreateInstanceDocument = `
    mutation createInstance($nodeId: ID!, $instanceableId: ID!, $instanceableType: DiagramEnum!, $positionX: Float, $positionY: Float) {
  createInstance(
    input: {params: {nodeId: $nodeId, instanceableId: $instanceableId, instanceableType: $instanceableType, positionX: $positionX, positionY: $positionY}}
  ) {
    instance {
      id
    }
  }
}
    `;
export const GetComponentsDocument = `
    query getComponents($instanceableId: ID!, $instanceableType: DiagramEnum!) {
  getComponents(
    instanceableId: $instanceableId
    instanceableType: $instanceableType
  ) {
    ...ComponentFields
  }
}
    ${ComponentFieldsFragmentDoc}`;
export const GetAvailableNodesDocument = `
    query getAvailableNodes($instanceableId: ID!, $instanceableType: DiagramEnum!, $searchTerm: String) {
  getAvailableNodes(
    instanceableId: $instanceableId
    instanceableType: $instanceableType
    searchTerm: $searchTerm
  ) {
    ...NodeFields
  }
}
    ${NodeFieldsFragmentDoc}`;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getInstances: build.query<GetInstancesQuery, GetInstancesQueryVariables>({
      query: (variables) => ({ document: GetInstancesDocument, variables })
    }),
    createInstance: build.mutation<CreateInstanceMutation, CreateInstanceMutationVariables>({
      query: (variables) => ({ document: CreateInstanceDocument, variables })
    }),
    getComponents: build.query<GetComponentsQuery, GetComponentsQueryVariables>({
      query: (variables) => ({ document: GetComponentsDocument, variables })
    }),
    getAvailableNodes: build.query<GetAvailableNodesQuery, GetAvailableNodesQueryVariables>({
      query: (variables) => ({ document: GetAvailableNodesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


