import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetLanguagesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = { getLanguages: Array<{ id: string, code: string, name: string }> };


export const GetLanguagesDocument = `
    query getLanguages {
  getLanguages {
    id
    code
    name
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getLanguages: build.query<GetLanguagesQuery, GetLanguagesQueryVariables | void>({
      query: (variables) => ({ document: GetLanguagesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


