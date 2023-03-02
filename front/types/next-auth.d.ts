/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

interface UserData {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

interface TokenData {
  accessToken: string | null
  expiry: string | null
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
  interface JWT {
    accessToken: string | null
    accessTokenExpires: string | null
    user: UserData
  }
}
