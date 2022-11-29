/**
 * The external imports
 */
import { getCookie, hasCookie } from 'cookies-next'
import { i18n } from 'next-i18next'

export default function (headers, { getState }) {
  headers.set('Accept-Language', i18n.language)
  let session = ''
  console.log(getCookie('session'))
  if (hasCookie('session')) {
    session = JSON.parse(getCookie('session'))
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
