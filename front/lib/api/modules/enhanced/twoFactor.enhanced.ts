/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  Enable2faMutation,
  GetOtpRequiredForLoginQuery,
  GetQrCodeUriQuery,
  api as generatedTwoFactorApi,
} from '../generated/twoFactor.generated'

type Definitions = DefinitionsFromApi<typeof generatedTwoFactorApi>

type GetQrCodeUri = GetQrCodeUriQuery['getQrCodeUri']
type GetOtpRequiredForLogin =
  GetOtpRequiredForLoginQuery['getOtpRequiredForLogin']

type UpdatedDefinitions = Omit<Definitions, 'getUsers' | 'getUser'> & {
  getOtpRequiredForLogin: OverrideResultType<
    Definitions['getOtpRequiredForLogin'],
    GetOtpRequiredForLogin
  >
  getQrCodeUri: OverrideResultType<Definitions['getQrCodeUri'], GetQrCodeUri>
}

export const twoFactorApi = generatedTwoFactorApi.enhanceEndpoints<
  'TwoFactor',
  UpdatedDefinitions
>({
  endpoints: {
    getQrCodeUri: {
      providesTags: ['TwoFactor'],
      transformResponse: (response: GetQrCodeUriQuery): GetQrCodeUri =>
        response.getQrCodeUri,
    },
    getOtpRequiredForLogin: {
      providesTags: ['TwoFactor'],
      transformResponse: (
        response: GetOtpRequiredForLoginQuery
      ): GetOtpRequiredForLogin => response.getOtpRequiredForLogin,
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
