/**
 * The external imports
 */
import { createSlice } from '@reduxjs/toolkit'

/**
 * Type definitions
 */
interface SessionState {
  accessToken: string
  client: string
  expiry: string
  uid: string
  role: string
}

const initialState = {
  accessToken: '',
  client: '',
  expiry: '',
  uid: '',
  role: '',
} as SessionState

const userSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (
      state,
      { payload: { accessToken, client, expiry, uid, role } }
    ) => {
      state.accessToken = accessToken
      state.client = client
      state.expiry = expiry
      state.uid = uid
      state.role = role
    },
  },
})

export const { setSession } = userSlice.actions

export default userSlice.reducer
