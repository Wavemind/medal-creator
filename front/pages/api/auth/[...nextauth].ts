/**
 * The external imports
 */
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { i18n } from 'next-i18next'

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
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': i18n?.language || 'en',
            },
          }
        )
        const user = await request.json()

        // If no error and we have user data, return it
        if (request.ok && user) {
          return {
            user: user.data,
            token: {
              accessToken: request.headers.get('access-token'),
              expiry: Number(request.headers.get('expiry')),
              uid: request.headers.get('uid'),
              client: request.headers.get('client'),
            },
          }
        } else {
          // Return an object that will pass error information through to the client-side.
          throw new Error(
            JSON.stringify({
              errors: user.errors,
              need_otp: user.need_otp,
              status: false,
            })
          )
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 48 * 60 * 60, // 48 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user && user.token) {
        token.accessToken = user.token.accessToken
        token.expiry = user.token.expiry
        token.uid = user.token.uid
        token.client = user.token.client
        token.user = user.user
      }

      delete token.name
      delete token.sub
      delete token.picture

      return token
    },
    async session({ session, token }) {
      session.user = {
        id: `${token.user.id}`,
        email: token.user.email,
        last_name: token.user.first_name,
        first_name: token.user.last_name,
        role: token.user.role,
        otp_required_for_login: token.user.otp_required_for_login,
      }
      return session
    },
  },
  events: {
    signOut(message) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign_out`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': i18n?.language || 'en',
          uid: message.token.uid!,
          client: message.token.client!,
          'access-token': message.token.accessToken!,
        },
      })
    },
  },
}

export default NextAuth(authOptions)
