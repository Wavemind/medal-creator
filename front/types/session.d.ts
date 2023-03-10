import { Role } from '@/lib/config/constants'

export type EmailInput = {
  email: string
}

export type PasswordInput = {
  password: string
}

export type SessionInputs = EmailInput & PasswordInput

export type PasswordInputs = PasswordInput & {
  passwordConfirmation: string
}

export type SessionState = {
  accessToken: string
  client: string
  expiry: string
  uid: string
  role: Role | ''
}
