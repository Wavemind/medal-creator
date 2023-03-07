/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  disable2faDocument,
  enable2faDocument,
  getOtpRequiredForLoginDocument,
  getQrCodeUriDocument,
} from './documents/twoFactor'
import type {
  ConfirmCode,
  CredentialsProps,
  TwoFactor,
} from '@/types/twoFactor'

export const userApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getQrCodeUri: build.query<TwoFactor, number>({
      query: id => ({
        document: getQrCodeUriDocument,
        variables: {
          userId: id,
        },
      }),
      transformResponse: (response: { getQrCodeUri: TwoFactor }) =>
        response.getQrCodeUri,
      providesTags: ['TwoFactor'],
    }),
    getOtpRequiredForLogin: build.query<TwoFactor, number>({
      query: id => ({
        document: getOtpRequiredForLoginDocument,
        variables: {
          userId: id,
        },
      }),
      transformResponse: (response: { getOtpRequiredForLogin: TwoFactor }) =>
        response.getOtpRequiredForLogin,
      providesTags: ['TwoFactor'],
    }),
    enable2fa: build.mutation<void, ConfirmCode & CredentialsProps>({
      query: values => ({
        document: enable2faDocument,
        variables: values,
      }),
      invalidatesTags: ['TwoFactor'],
    }),
    disable2fa: build.mutation<void, CredentialsProps>({
      query: values => ({
        document: disable2faDocument,
        variables: values,
      }),
      invalidatesTags: ['TwoFactor'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetQrCodeUriQuery,
  useGetOtpRequiredForLoginQuery,
  useEnable2faMutation,
  useDisable2faMutation,
} = userApi

// Export endpoints for use in SSR
export const { getQrCodeUri, getOtpRequiredForLogin } = userApi.endpoints
