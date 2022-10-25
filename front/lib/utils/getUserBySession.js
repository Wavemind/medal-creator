/**
 * The external imports
 */
import { getCookie, hasCookie } from 'cookies-next'

export default function (req = null, res = null) {
  let session = ''
  if (hasCookie('session', { req, res })) {
    session = JSON.parse(getCookie('session', { req, res }))
  }

  return session
}
