/**
 * The external imports
 */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const userSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, { payload: { accessToken, client, expiry, uid } }) => {
      state.accessToken = accessToken
      state.client = client
      state.expiry = expiry
      state.uid = uid
    },
  },
})

export const { setSession } = userSlice.actions

export default userSlice.reducer
