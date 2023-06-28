import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetAdministrationRoutesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAdministrationRoutesQuery = { getAdministrationRoutes: Array<{ __typename?: 'AdministrationRoute', id: string, category: string, nameTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> };


export const GetAdministrationRoutesDocument = `
    query getAdministrationRoutes {
  getAdministrationRoutes {
    id
    category
    nameTranslations {
      en
      fr
    }
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getAdministrationRoutes: build.query<GetAdministrationRoutesQuery, GetAdministrationRoutesQueryVariables | void>({
      query: (variables) => ({ document: GetAdministrationRoutesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


