import { createSlice } from '@reduxjs/toolkit'

/**
 * Default state object with initial values.
 */
const initialState = {
  name: 'Quentin',
  email: 'quentin@gmail.com',
}

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
  },
})

// Exports all actions
export const { setName, setEmail } = userSlice.actions

export default userSlice.reducer
