/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal import
 */
import type { RoleEnum } from './graphql'
import type { UserId } from './common'

export type SessionInputs = {
  email: string
  password: string
}

export type AuthComponent = FC<UserId>

export type SessionState = {
  accessToken: string
  client: string
  expiry: string
  uid: string
  role: RoleEnum | ''
}
