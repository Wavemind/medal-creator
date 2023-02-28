import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')

      // TODO : A voir si on doit garder tout ca vu qu'on a une page SignIn custom
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.

      // TODO : A voir si on doit garder tout ca vu qu'on a une page SignIn custom
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch('http://localhost:3000/api/v1/auth/sign_in', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        })
        const user = await res.json()

        // Jusqu'ici j'arrive a obtenir user, mais je n'arrive pas a le stocker dans une session
        console.log(user)

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
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
    async signIn({ user }) {
      if (user) {
        console.log(user)
        // TODO : Trouver comment stocker user et ensuite redirect sur la home page
        // Good luck buddy
        return true
      }
      return false
    },
  },
}

export default NextAuth(authOptions)
