/**
 * The externall imports
 */
import type { FC } from 'react'

/**
 * The internal import
 */
import { Role } from '@/lib/config/constants'
import type { UserId } from './common'

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

export type AuthComponent = FC<UserId>

export type SessionState = {
  accessToken: string
  client: string
  expiry: string
  uid: string
  role: Role | ''
}
