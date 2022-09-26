/**
 * The external imports
 */
import { setCookie } from 'cookies-next'

export default async function handler(req, res) {
  console.log('################################################################################')
  console.log('################################################################################')
  console.log('################################################################################')
  console.log('dans le new')
  let headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  try {
    const response = await fetch(`${process.env.API_URL}/v1/auth/sign_in`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if ([200, 201].includes(response.status)) {
      setCookie(
        'session',
        JSON.stringify({
          accessToken: response.headers.get('access-token'),
          expiry: response.headers.get('expiry'),
          uuid: response.headers.get('uuid'),
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
