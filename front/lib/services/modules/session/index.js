/**
 * The internal imports
 */
import { apiRest } from '../../apiRest'
import newSessionMutation from './newSession'
import deleteSessionMutation from './deleteSession'
import resetPasswordMutation from './resetPassword'
import newPasswordMutation from './newPassword'

export const sessionApi = apiRest.injectEndpoints({
  endpoints: build => ({
    newSession: newSessionMutation(build),
    deleteSession: deleteSessionMutation(build),
    resetPassword: resetPasswordMutation(build),
    newPassword: newPasswordMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useNewSessionMutation,
  useDeleteSessionMutation,
  useResetPasswordMutation,
  useNewPasswordMutation,
  util: { getRunningOperationPromises },
} = sessionApi
