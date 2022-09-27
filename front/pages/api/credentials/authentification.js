/**
 * The external imports
 */
import { getCookie, setCookie } from 'cookies-next'

export default async function handler(req, res) {
  const session = JSON.parse(getCookie('session', { req, res }))

  let headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  headers.set('uid', session.uid)
  headers.set('access-token', session.accessToken)
  headers.set('client', session.client)

  const { body } = req

  try {
    // Auth user
    const response = await fetch(
      `${process.env.API_URL}/v1/webauthn/authentications`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()

    if ([200, 201].includes(response.status)) {
      setCookie(
        'session',
        JSON.stringify({
          accessToken: response.headers.get('access-token'),
          expiry: response.headers.get('expiry'),
          uid: response.headers.get('uid'),
          client: response.headers.get('client'),
        }),
        {
          req,
          res,
          maxAge: 60 * 6 * 24,
        }
      )
      res.status(200).json(data)
      return
    }

    res.status(response.status).send(data)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

  res.end()
}
