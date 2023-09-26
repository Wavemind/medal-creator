import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetQrCodeUriQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID'];
}>;


export type GetQrCodeUriQuery = { getQrCodeUri: { __typename?: 'User', otpProvisioningUri?: string | null, otpSecret?: string | null } };

export type GetOtpRequiredForLoginQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID'];
}>;


export type GetOtpRequiredForLoginQuery = { getOtpRequiredForLogin: { __typename?: 'User', otpRequiredForLogin?: boolean | null } };

export type Enable2faMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID'];
  code: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type Enable2faMutation = { enable2fa?: { __typename?: 'Enable2faPayload', id: string } | null };

export type Disable2faMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID'];
}>;


export type Disable2faMutation = { disable2fa?: { __typename?: 'Disable2faPayload', id?: string | null } | null };


export const GetQrCodeUriDocument = `
    query getQrCodeUri($userId: ID!) {
  getQrCodeUri(userId: $userId) {
    otpProvisioningUri
    otpSecret
  }
}
    `;
export const GetOtpRequiredForLoginDocument = `
    query getOtpRequiredForLogin($userId: ID!) {
  getOtpRequiredForLogin(userId: $userId) {
    otpRequiredForLogin
  }
}
    `;
export const Enable2faDocument = `
    mutation enable2fa($userId: ID!, $code: String!, $password: String!) {
  enable2fa(input: {params: {userId: $userId, code: $code, password: $password}}) {
    id
  }
}
    `;
export const Disable2faDocument = `
    mutation disable2fa($userId: ID!) {
  disable2fa(input: {params: {userId: $userId}}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getQrCodeUri: build.query<GetQrCodeUriQuery, GetQrCodeUriQueryVariables>({
      query: (variables) => ({ document: GetQrCodeUriDocument, variables })
    }),
    getOtpRequiredForLogin: build.query<GetOtpRequiredForLoginQuery, GetOtpRequiredForLoginQueryVariables>({
      query: (variables) => ({ document: GetOtpRequiredForLoginDocument, variables })
    }),
    enable2fa: build.mutation<Enable2faMutation, Enable2faMutationVariables>({
      query: (variables) => ({ document: Enable2faDocument, variables })
    }),
    disable2fa: build.mutation<Disable2faMutation, Disable2faMutationVariables>({
      query: (variables) => ({ document: Disable2faDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


