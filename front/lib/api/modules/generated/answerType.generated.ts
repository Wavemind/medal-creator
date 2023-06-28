import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetAnswerTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAnswerTypesQuery = { getAnswerTypes: Array<{ __typename?: 'AnswerType', id: string, display: string, value: string, labelKey: string }> };


export const GetAnswerTypesDocument = `
    query getAnswerTypes {
  getAnswerTypes {
    id
    display
    value
    labelKey
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getAnswerTypes: build.query<GetAnswerTypesQuery, GetAnswerTypesQueryVariables | void>({
      query: (variables) => ({ document: GetAnswerTypesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


