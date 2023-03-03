/**
 * The external imports
 */
import { gql } from 'graphql-request'

export const getQrCodeUriDocument = gql`
  query ($userId: ID!) {
    getQrCodeUri(userId: $userId) {
      otpProvisioningUri
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
