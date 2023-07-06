/**
 * The external imports
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

/**
 * The internal imports
 */
import type { RoleEnum } from './graphql'
import type { Scalars } from './graphql'

interface UserData {
  id: Scalars['ID']
  email: string
  first_name: string
  last_name: string
  role: RoleEnum
}

interface TokenData {
  accessToken: string | null
  expiry: number | null
  uid: string | null
  client: string | null
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserData
  }

  interface User {
    user: UserData
    token: TokenData
    id?: string
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends TokenData {
    user: UserData
    error?: string
  }
}
