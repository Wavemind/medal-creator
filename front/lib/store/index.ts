/**
 * The external imports
 */
import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import { apiRest } from '../services/apiRest'
import { apiGraphql } from '../services/apiGraphql'
import session from './session'

export const store = configureStore({
  reducer: {
    [apiRest.reducerPath]: apiRest.reducer,
    [apiGraphql.reducerPath]: apiGraphql.reducer,
    session,
  },
  middleware: gDM =>
    gDM().concat(apiRest.middleware).concat(apiGraphql.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const wrapper = createWrapper(() => store)
