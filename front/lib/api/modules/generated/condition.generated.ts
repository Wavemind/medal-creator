import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetConditionQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetConditionQuery = { getCondition?: { __typename?: 'Condition', id: string, cutOffStart?: number | null, cutOffEnd?: number | null, score?: number | null, answer: { __typename?: 'Answer', id: string }, instance: { __typename?: 'Instance', id: string } } | null };

export type CreateConditionMutationVariables = Types.Exact<{
  answerId: Types.Scalars['ID'];
  instanceId: Types.Scalars['ID'];
  cutOffStart?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffEnd?: Types.InputMaybe<Types.Scalars['Int']>;
  score?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type CreateConditionMutation = { createCondition: { __typename?: 'CreateConditionPayload', condition?: { __typename?: 'Condition', id: string, answer: { __typename?: 'Answer', id: string, nodeId: string }, instance: { __typename?: 'Instance', id: string } } | null } };

export type UpdateConditionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  answerId?: Types.InputMaybe<Types.Scalars['ID']>;
  instanceId?: Types.InputMaybe<Types.Scalars['ID']>;
  cutOffStart?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffEnd?: Types.InputMaybe<Types.Scalars['Int']>;
  score?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type UpdateConditionMutation = { updateCondition?: { __typename?: 'UpdateConditionPayload', condition?: { __typename?: 'Condition', id: string } | null } | null };

export type DestroyConditionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyConditionMutation = { destroyCondition?: { __typename?: 'DestroyConditionPayload', id?: string | null } | null };


export const GetConditionDocument = `
    query getCondition($id: ID!) {
  getCondition(id: $id) {
    id
    answer {
      id
    }
    instance {
      id
    }
    cutOffStart
    cutOffEnd
    score
  }
}
    `;
export const CreateConditionDocument = `
    mutation createCondition($answerId: ID!, $instanceId: ID!, $cutOffStart: Int, $cutOffEnd: Int, $score: Int) {
  createCondition(
    input: {params: {answerId: $answerId, instanceId: $instanceId, cutOffStart: $cutOffStart, cutOffEnd: $cutOffEnd, score: $score}}
  ) {
    condition {
      id
      answer {
        id
        nodeId
      }
      instance {
        id
      }
    }
  }
}
    `;
export const UpdateConditionDocument = `
    mutation updateCondition($id: ID!, $answerId: ID, $instanceId: ID, $cutOffStart: Int, $cutOffEnd: Int, $score: Int) {
  updateCondition(
    input: {params: {id: $id, answerId: $answerId, instanceId: $instanceId, cutOffStart: $cutOffStart, cutOffEnd: $cutOffEnd, score: $score}}
  ) {
    condition {
      id
    }
  }
}
    `;
export const DestroyConditionDocument = `
    mutation destroyCondition($id: ID!) {
  destroyCondition(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getCondition: build.query<GetConditionQuery, GetConditionQueryVariables>({
      query: (variables) => ({ document: GetConditionDocument, variables })
    }),
    createCondition: build.mutation<CreateConditionMutation, CreateConditionMutationVariables>({
      query: (variables) => ({ document: CreateConditionDocument, variables })
    }),
    updateCondition: build.mutation<UpdateConditionMutation, UpdateConditionMutationVariables>({
      query: (variables) => ({ document: UpdateConditionDocument, variables })
    }),
    destroyCondition: build.mutation<DestroyConditionMutation, DestroyConditionMutationVariables>({
      query: (variables) => ({ document: DestroyConditionDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


