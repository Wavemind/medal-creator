/**
 * The external imports
 */
import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import { api } from '../services/api'
import session from './session'

export const store = configureStore({
  reducer: {
    api: api.reducer,
    session,
  },
  middleware: gDM => gDM().concat(api.middleware),
})

setupListeners(store.dispatch)

export const wrapper = createWrapper(() => store)
