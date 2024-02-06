import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type ValidateQueryVariables = Types.Exact<{
  instanceableId: Types.Scalars['ID'];
  instanceableType: Types.DiagramEnum;
}>;


export type ValidateQuery = { validate: { errors: Array<string>, warnings: Array<string> } };


export const ValidateDocument = `
    query validate($instanceableId: ID!, $instanceableType: DiagramEnum!) {
  validate(instanceableId: $instanceableId, instanceableType: $instanceableType) {
    errors
    warnings
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    validate: build.query<ValidateQuery, ValidateQueryVariables>({
      query: (variables) => ({ document: ValidateDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


