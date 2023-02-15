/**
 * The external imports
 */
import { setCookie, deleteCookie } from 'cookies-next'
import { setUser } from '@sentry/nextjs'

/**
 * The internal imports
 */
import { apiRest } from '@/lib/services/apiRest'

/**
 * Type imports
 */
import type {
  SessionInputs,
  Session,
  SessionLogout,
  EmailInput,
} from '@/types/session'

export const sessionApi = apiRest.injectEndpoints({
  endpoints: builder => ({
    newSession: builder.mutation<Session, SessionInputs>({
      query: ({ email, password }) => ({
        url: '/v1/auth/sign_in',
        method: 'POST',
        body: {
          email,
          password,
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
              { req: undefined, res: undefined }
            )

            setUser(response.data)
            return response.data
          }
          return response
        },
      }),
    }),
    deleteSession: builder.mutation<SessionLogout, void>({
      query: () => ({
        url: '/v1/auth/sign_out',
        method: 'DELETE',
        responseHandler: async request => {
          const response = await request.json()
          if (request.ok) {
            deleteCookie('session')
            return response
          }
          return response
        },
      }),
      invalidatesTags: ['Session'],
    }),
    resetPassword: builder.mutation<void, EmailInput>({
      query: ({ email }) => ({
        url: '/v1/auth/password',
        method: 'POST',
        body: {
          email,
          redirect_url: `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/new-password`,
        },
      }),
      invalidatesTags: ['Session'],
    }),
    // TODO : Check if we need types for this query.
    // Something like <void, { values: PasswordInputs; query: string(???) }>
    newPassword: builder.mutation({
      query: ({ values, headers }) => ({
        url: '/v1/auth/password',
        method: 'PUT',
        body: {
          password: values.password,
          password_confirmation: values.passwordConfirmation,
        },
        headers: headers,
      }),
      invalidatesTags: ['Session'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useNewSessionMutation,
  useDeleteSessionMutation,
  useResetPasswordMutation,
  useNewPasswordMutation,
} = sessionApi
