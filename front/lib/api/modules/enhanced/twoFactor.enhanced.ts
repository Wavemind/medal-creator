/**
 * The internal imports
 */
import { api as generatedTwoFactorApi } from '../generated/twoFactor.generated'

export const twoFactorApi = generatedTwoFactorApi.enhanceEndpoints({
  addTagTypes: ['TwoFactor'],
  endpoints: {
    getQrCodeUri: {
      providesTags: ['TwoFactor'],
      transformResponse: response => response.getQrCodeUri,
    },
    getOtpRequiredForLogin: {
      providesTags: ['TwoFactor'],
      transformResponse: response => response.getOtpRequiredForLogin,
    },
    enable2fa: {
      invalidatesTags: ['TwoFactor'],
    },
    disable2fa: {
      invalidatesTags: ['TwoFactor'],
    },
  },
})

export const {
  useDisable2faMutation,
  useGetOtpRequiredForLoginQuery,
  useGetQrCodeUriQuery,
  useEnable2faMutation,
} = twoFactorApi

// Export endpoints for use in SSR
export const { getQrCodeUri, getOtpRequiredForLogin } = twoFactorApi.endpoints
