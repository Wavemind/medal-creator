/**
 * The external imports
 */
import { i18n } from 'next-i18next'

export default async function (
  headers: Headers,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { getState }: { getState: () => any }
): Promise<Headers> {
  headers.set('Accept-Language', i18n?.language || 'en')
  const session = getState().session

  if (session.accessToken) {
    headers.set('access-token', session.accessToken)
    headers.set('client', session.client)
    headers.set('expiry', session.expiry)
    headers.set('uid', session.uid)
  }

  return headers
}
