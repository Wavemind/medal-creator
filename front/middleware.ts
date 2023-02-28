import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // TODO ADD LOGIC PATH
      // `/admin` requires admin role
      // if (req.nextUrl.pathname === '/admin') {
      //   return token?.userRole === 'admin'
      // }
      // `/me` only requires the user to be logged in
      return !!token
    },
  },
})

export const config = { matcher: ['/'] }
