import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        const request = await fetch(
          'http://localhost:3000/api/v1/auth/sign_in',
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const user = await request.json()

        console.log('ICI', user)

        // If no error and we have user data, return it
        if (request.ok && user) {
          return {
            ...user.data,
            token: {
              accessToken: request.headers.get('access-token'),
              expiry: request.headers.get('expiry'),
              uid: request.headers.get('uid'),
              client: request.headers.get('client'),
            },
          }
        } else {
          console.log('HELLO', user)
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
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.token) {
        return user
      }

      return token
    },
    async session({ session, token }) {
      session.user = {
        email: token.email,
        first_name: token.first_name,
        last_name: token.last_name,
        role: token.role,
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
