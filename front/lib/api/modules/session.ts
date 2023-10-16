/**
 * The internal imports
 */
import { apiRest } from '@/lib/api/apiRest'

export const sessionApi = apiRest.injectEndpoints({
  endpoints: builder => ({
    resetPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/v2/auth/password',
        method: 'POST',
        body: {
          email,
          redirect_url: `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/new-password`,
        },
      }),
      invalidatesTags: ['Session'],
    }),
    newPassword: builder.mutation({
      query: ({ values, query }) => ({
        url: '/v2/auth/password',
        method: 'PUT',
        body: {
          password: values.password,
          password_confirmation: values.passwordConfirmation,
        },
        headers: query,
      }),
      invalidatesTags: ['Session'],
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useResetPasswordMutation, useNewPasswordMutation } = sessionApi
