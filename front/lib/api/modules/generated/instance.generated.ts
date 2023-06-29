import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetInstancesQueryVariables = Types.Exact<{
  nodeId: Types.Scalars['ID'];
  algorithmId?: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type GetInstancesQuery = { getInstances: Array<{ __typename?: 'Instance', id: string, diagramName?: string | null, instanceableType: string, instanceableId: number, diagnosisId?: number | null }> };


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

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getInstances: build.query<GetInstancesQuery, GetInstancesQueryVariables>({
      query: (variables) => ({ document: GetInstancesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


