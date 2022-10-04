/**
 * The internal imports
 */
import { api } from '../../api'
import generateChallengeMutation from './generateChallenge'
import addCredentialMutation from './addCredential'
import getCredentialsQuery from './getCredentials'
import deleteCredentialMutation from './deleteCredential'
import authenticateMutation from './authenticate'

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    generateChallenge: generateChallengeMutation(build),
    addCredential: addCredentialMutation(build),
    deleteCredential: deleteCredentialMutation(build),
    getCredentials: getCredentialsQuery(build),
    authenticate: authenticateMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGenerateChallengeMutation,
  useAddCredentialMutation,
  useGetCredentialsQuery,
  useDeleteCredentialMutation,
  useAuthenticateMutation,
  util: { getRunningOperationPromises },
} = authApi

// Export endpoints for use in SSR
export const { getCredentials } = authApi.endpoints
