import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetInstancesQueryVariables = Types.Exact<{
  nodeId: Types.Scalars['ID'];
  algorithmId?: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type GetInstancesQuery = { getInstances: Array<{ __typename?: 'Instance', id: string, diagramName?: string | null, instanceableType: string, instanceableId: string, diagnosisId?: string | null }> };

export type GetInstanceQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetInstanceQuery = { getInstance: { __typename?: 'Instance', id: string, instanceableType: string, instanceableId: string, isPreReferral?: boolean | null, positionX: number, positionY: number, diagnosisId?: string | null, nodeId: string, durationTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null } };

export type CreateInstanceMutationVariables = Types.Exact<{
  nodeId: Types.Scalars['ID'];
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  durationTranslations?: Types.InputMaybe<Types.HstoreInput>;
  isPreReferral?: Types.InputMaybe<Types.Scalars['Boolean']>;
  diagnosisId?: Types.InputMaybe<Types.Scalars['ID']>;
  positionX?: Types.InputMaybe<Types.Scalars['Float']>;
  positionY?: Types.InputMaybe<Types.Scalars['Float']>;
}>;


export type CreateInstanceMutation = { createInstance: { __typename?: 'CreateInstancePayload', instance: { __typename?: 'Instance', id: string } } };

export type GetComponentsQueryVariables = Types.Exact<{
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
}>;


export type GetComponentsQuery = { getComponents: Array<{ __typename?: 'Instance', id: string, positionX: number, positionY: number, conditions: Array<{ __typename?: 'Condition', id: string, cutOffStart?: number | null, cutOffEnd?: number | null, score?: number | null, answer: { __typename?: 'Answer', id: string, nodeId: string } }>, node: { __typename?: 'Node', id: string, fullReference: string, category: string, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } }> };

export type GetAvailableNodesQueryVariables = Types.Exact<{
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
  filters?: Types.InputMaybe<Types.NodeFilterInput>;
}>;


export type GetAvailableNodesQuery = { getAvailableNodes: { __typename?: 'NodeConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'NodeEdge', node: { __typename?: 'Node', id: string, fullReference: string, category: string, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } }> } };

export type UpdateInstanceMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  positionX?: Types.InputMaybe<Types.Scalars['Float']>;
  positionY?: Types.InputMaybe<Types.Scalars['Float']>;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  durationTranslations?: Types.InputMaybe<Types.HstoreInput>;
  isPreReferral?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type UpdateInstanceMutation = { updateInstance: { __typename?: 'UpdateInstancePayload', instance: { __typename?: 'Instance', id: string } } };

export type DestroyInstanceMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyInstanceMutation = { destroyInstance?: { __typename?: 'DestroyInstancePayload', id?: string | null } | null };


export const GetInstancesDocument = `
    query getInstances($nodeId: ID!, $algorithmId: ID) {
  getInstances(nodeId: $nodeId, algorithmId: $algorithmId) {
    id
    diagramName
    instanceableType
    instanceableId
    diagnosisId
  }
}
    `;
export const GetInstanceDocument = `
    query getInstance($id: ID!) {
  getInstance(id: $id) {
    id
    instanceableType
    instanceableId
    isPreReferral
    positionX
    positionY
    durationTranslations {
      ...HstoreLanguages
    }
    descriptionTranslations {
      ...HstoreLanguages
    }
    diagnosisId
    nodeId
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const CreateInstanceDocument = `
    mutation createInstance($nodeId: ID!, $instanceableId: ID!, $instanceableType: DiagramEnum!, $descriptionTranslations: HstoreInput, $durationTranslations: HstoreInput, $isPreReferral: Boolean, $diagnosisId: ID, $positionX: Float, $positionY: Float) {
  createInstance(
    input: {params: {nodeId: $nodeId, instanceableId: $instanceableId, instanceableType: $instanceableType, descriptionTranslations: $descriptionTranslations, durationTranslations: $durationTranslations, isPreReferral: $isPreReferral, diagnosisId: $diagnosisId, positionX: $positionX, positionY: $positionY}}
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
    id
    positionX
    positionY
    conditions {
      id
      answer {
        id
        nodeId
      }
      cutOffStart
      cutOffEnd
      score
    }
    node {
      id
      fullReference
      labelTranslations {
        ...HstoreLanguages
      }
      excludingNodes {
        id
      }
      category
      isNeonat
      diagramAnswers {
        id
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const GetAvailableNodesDocument = `
    query getAvailableNodes($instanceableId: ID!, $instanceableType: DiagramEnum!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String, $filters: NodeFilterInput) {
  getAvailableNodes(
    instanceableId: $instanceableId
    instanceableType: $instanceableType
    after: $after
    before: $before
    first: $first
    last: $last
    searchTerm: $searchTerm
    filters: $filters
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
        fullReference
        labelTranslations {
          ...HstoreLanguages
        }
        excludingNodes {
          id
        }
        category
        isNeonat
        diagramAnswers {
          id
          labelTranslations {
            ...HstoreLanguages
          }
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const UpdateInstanceDocument = `
    mutation updateInstance($id: ID!, $positionX: Float, $positionY: Float, $descriptionTranslations: HstoreInput, $durationTranslations: HstoreInput, $isPreReferral: Boolean) {
  updateInstance(
    input: {params: {id: $id, positionX: $positionX, positionY: $positionY, descriptionTranslations: $descriptionTranslations, durationTranslations: $durationTranslations, isPreReferral: $isPreReferral}}
  ) {
    instance {
      id
    }
  }
}
    `;
export const DestroyInstanceDocument = `
    mutation destroyInstance($id: ID!) {
  destroyInstance(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getInstances: build.query<GetInstancesQuery, GetInstancesQueryVariables>({
      query: (variables) => ({ document: GetInstancesDocument, variables })
    }),
    getInstance: build.query<GetInstanceQuery, GetInstanceQueryVariables>({
      query: (variables) => ({ document: GetInstanceDocument, variables })
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
    updateInstance: build.mutation<UpdateInstanceMutation, UpdateInstanceMutationVariables>({
      query: (variables) => ({ document: UpdateInstanceDocument, variables })
    }),
    destroyInstance: build.mutation<DestroyInstanceMutation, DestroyInstanceMutationVariables>({
      query: (variables) => ({ document: DestroyInstanceDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


