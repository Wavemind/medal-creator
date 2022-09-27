/**
 * The internal imports
 */
import { api } from '../../api'
import newSessionMutation from './newSession'
import deleteSessionMutation from './deleteSession'

export const sessionApi = api.injectEndpoints({
  endpoints: build => ({
    newSession: newSessionMutation(build),
    deleteSession: deleteSessionMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useNewSessionMutation,
  useDeleteSessionMutation,
  util: { getRunningOperationPromises },
} = sessionApi
