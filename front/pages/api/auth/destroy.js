/**
 * The external imports
 */
import { deleteCookie, getCookie } from 'cookies-next'

export default async function handler(req, res) {
  const session = getCookie('session', { req, res })

  let headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${session.accessToken}`)

  try {
    const response = await fetch(`${process.env.API_URL}/v1/auth/sign_out`, {
      method: 'DELETE',
      headers: headers,
    })

    const data = await response.json()

    if ([200, 201].includes(response.status)) {
      deleteCookie('session', { req, res })
      res.status(200).json(data)
      return
    }

    res.status(response.status).send(data)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

  res.end()
}
