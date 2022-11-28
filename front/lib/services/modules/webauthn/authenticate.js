/**
 * The external imports
 */
import { setCookie } from 'cookies-next'
import * as Sentry from '@sentry/nextjs'

export default build =>
  build.mutation({
    query: ({ credentials, email }) => ({
      url: '/v1/webauthn/authentications',
      method: 'POST',
      body: {
        credentials,
        email,
      },
      responseHandler: async request => {
        const response = await request.json()
        if (request.ok && response.data) {
          setCookie(
            'session',
            JSON.stringify({
              accessToken: request.headers.get('access-token'),
              expiry: request.headers.get('expiry'),
              uid: request.headers.get('uid'),
              client: request.headers.get('client'),
              role: response.data.role,
              userId: response.data.id,
            }),
            { req: null, res: null }
          )
          Sentry.setUser(response.data)
          return response.data
        }
        return response
      },
    }),
  })
