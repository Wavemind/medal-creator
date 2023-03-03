export type TwoFactor = {
  otpRequiredForLogin: boolean
  otpProvisioningUri: string
  otpSecret: string
}

export type CredentialsProps = {
  userId: number
}
