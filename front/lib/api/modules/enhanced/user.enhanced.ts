/**
 * The internal imports
 */
import { api as generatedUserApi } from '../generated/user.generated'

export const userApi = generatedUserApi.enhanceEndpoints({
  addTagTypes: ['User'],
  endpoints: {
    getUsers: {
      providesTags: ['User'],
      transformResponse: response => response.getUsers,
    },
    getUser: {
      providesTags: ['User'],
      transformResponse: response => response.getUser,
    },
    createUser: {
      invalidatesTags: ['User'],
    },
    updateUser: {
      invalidatesTags: ['User'],
    },
    updatePassword: {
      invalidatesTags: ['User'],
    },
    acceptInvitation: {
      invalidatesTags: ['User'],
    },
    lockUser: {
      invalidatesTags: ['User'],
    },
    unlockUser: {
      invalidatesTags: ['User'],
    },
  },
})

// Export endpoints for use in SSR
export const { getUser, getUsers } = userApi.endpoints
