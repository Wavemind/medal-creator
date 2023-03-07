/**
 * The external imports
 */
import { i18n } from 'next-i18next'
import { RootState } from '../store'

export const prepareHeaders = async (
  headers: Headers,
  { getState }: { getState: () => unknown }
) => {
  headers.set('Accept-Language', i18n?.language || 'en')
  const state = getState()

  if (_isSessionInStore(state) && state.session.accessToken) {
    headers.set('access-token', state.session.accessToken)
    headers.set('client', state.session.client)
    headers.set('expiry', state.session.expiry)
    headers.set('uid', state.session.uid)
  }

  return headers
}

const _isSessionInStore = (state: unknown): state is RootState => {
  return (
    typeof state === 'object' &&
    state !== null &&
    Object.keys(state).includes('session')
  )
}
