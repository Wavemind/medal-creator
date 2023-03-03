/**
 * The external imports
 */
import { gql } from 'graphql-request'

export const getQrCodeUriDocument = gql`
  query ($userId: ID!) {
    getQrCodeUri(userId: $userId) {
      otpProvisioningUri
      otpSecret
    }
  }
`

export const getOtpRequiredForLoginDocument = gql`
  query ($userId: ID!) {
    getOtpRequiredForLogin(userId: $userId) {
      otpRequiredForLogin
    }
  }
`

export const enable2faDocument = gql`
  mutation ($userId: Int!, $code: String!, $password: String!) {
    enable2fa(
      input: { params: { userId: $userId, code: $code, password: $password } }
    ) {
      id
    }
  }
`

export const disable2faDocument = gql`
  mutation ($userId: Int!) {
    disable2fa(input: { params: { userId: $userId } }) {
      id
    }
  }
`
