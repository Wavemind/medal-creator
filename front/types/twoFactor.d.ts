export type TwoFactor = {
  otpRequiredForLogin: boolean
  otpProvisioningUri: string
  otpSecret: string
}

export type ConfirmCode = {
  code: string
  password: string
}
