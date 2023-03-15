/**
 * The external imports
 */
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith('/auth')) {
        return true
      } else {
        return !!token
      }
    },
  },
})
