/**
 * The external imports
 */
import { getCookie, hasCookie } from 'cookies-next'
import { i18n } from 'next-i18next'

/**
 * The internal imports
 */
import type { SessionState } from '@/types/session'

export default function (
  headers: Headers,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { getState }: { getState: () => any }
): Headers {
  headers.set('Accept-Language', i18n?.language || 'en')
  let session: SessionState

  if (hasCookie('session')) {
    session = JSON.parse(getCookie('session') as string)
  } else if (getState().session.accessToken) {
    session = getState().session
  } else {
    return headers
  }

  headers.set('access-token', session.accessToken)
  headers.set('client', session.client)
  headers.set('expiry', session.expiry)
  headers.set('uid', session.uid)

  return headers
}
