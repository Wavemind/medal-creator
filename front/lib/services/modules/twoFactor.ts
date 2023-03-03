/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  getOtpRequiredForLoginDocument,
  getQrCodeUriDocument,
} from './documents/twoFactor'
import type { TwoFactor } from '@/types/twoFactor'

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
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetQrCodeUriQuery, useGetOtpRequiredForLoginQuery } = userApi

// Export endpoints for use in SSR
export const { getQrCodeUri, getOtpRequiredForLogin } = userApi.endpoints
