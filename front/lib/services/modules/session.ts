/**
 * The internal imports
 */
import { apiRest } from '@/lib/services/apiRest'

/**
 * Type imports
 */
import type { EmailInput } from '@/types/session'

export const sessionApi = apiRest.injectEndpoints({
  endpoints: builder => ({
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
      query: ({ values, query }) => ({
        url: '/v1/auth/password',
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
