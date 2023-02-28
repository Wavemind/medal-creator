/**
 * The external imports
 */
import NextAuth from 'next-auth'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [],
  pages: {
    signIn: '/auth/sign-in',
  },
}

export default NextAuth(authOptions)
