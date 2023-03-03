export type TwoFactor = {
  otpRequiredForLogin: boolean
  otpProvisioningUri: string
  otpSecret: string
}

export type CredentialsProps = {
  userId: number
}

export type ConfirmCode = {
  code: string
  password: string
}
