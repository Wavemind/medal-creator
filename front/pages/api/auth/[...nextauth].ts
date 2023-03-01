/**
 * The external imports
 */
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const request = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign_in`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const user = await request.json()

        // If no error and we have user data, return it
        if (request.ok && user) {
          return {
            user: user.data,
            token: {
              accessToken: request.headers.get('access-token'),
              expiry: request.headers.get('expiry'),
              uid: request.headers.get('uid'),
              client: request.headers.get('client'),
            },
          }
        }
        // Return null if user data could not be retrieved
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user && user.token) {
        token.accessToken = user.token.accessToken
        token.accessTokenExpires = user.token.expiry
        token.user = user.user
      }

      delete token.name
      delete token.sub
      delete token.picture

      return token
    },
    async session({ session, token }) {
      session.user = {
        email: token.user.email,
        first_name: token.user.first_name,
        last_name: token.user.last_name,
        role: token.user.role,
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
