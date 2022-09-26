/**
 * The internal imports
 */
import { api } from '../../api'
import newSessionMutation from './newSession'
import destroySessionMutation from './destroySession'
// import challenge from './challenge'
// import createCredentials from './credentials'
// import getAllCredentials from './getAllCredentials'
// import deleteCredentials from './deleteCredentials'
// import authenticate from './authenticate'

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    newSession: newSessionMutation(build),
    destroySession: destroySessionMutation(build),
    // challenge: challenge(build),
    // createCredentials: createCredentials(build),
    // deleteCredentials: deleteCredentials(build),
    // getAllCredentials: getAllCredentials(build),
    // authenticate: authenticate(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useNewSessionMutation,
  useDestroySessionMutation,
  // useChallengeMutation,
  // useCreateCredentialsMutation,
  // useDeleteCredentialsMutation,
  // useLazyGetAllCredentialsQuery,
  // useAuthenticateMutation,
  util: { getRunningOperationPromises },
} = authApi
