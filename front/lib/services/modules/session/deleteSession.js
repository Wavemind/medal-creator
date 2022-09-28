/**
 * The external imports
 */
import { deleteCookie } from 'cookies-next'

export default build =>
  build.mutation({
    query: () => ({
      url: '/v1/auth/sign_out',
      method: 'DELETE',
      responseHandler: async request => {
        const response = await request.json()
        if (request.ok) {
          deleteCookie('session')
          return response.data
        }
        return response
      },
    }),
  })
