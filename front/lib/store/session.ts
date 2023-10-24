/**
 * The external imports
 */
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

/**
 * The internal imports
 */
import { SessionState } from '@/types'

const initialState: SessionState = {
  accessToken: '',
  client: '',
  expiry: '',
  uid: '',
  role: '',
}

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
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.session,
      }
    },
  },
})

export const { setSession } = userSlice.actions

export default userSlice.reducer
