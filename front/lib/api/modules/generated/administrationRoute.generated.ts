import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetAdministrationRoutesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAdministrationRoutesQuery = { getAdministrationRoutes: Array<{ id: string, category: string, nameTranslations: { en?: string | null, fr?: string | null } }> };


export const GetAdministrationRoutesDocument = `
    query getAdministrationRoutes {
  getAdministrationRoutes {
    id
    category
    nameTranslations {
      ...HstoreLanguages
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getAdministrationRoutes: build.query<GetAdministrationRoutesQuery, GetAdministrationRoutesQueryVariables | void>({
      query: (variables) => ({ document: GetAdministrationRoutesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


