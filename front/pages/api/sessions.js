/**
 * The external imports
 */
import { setCookie, getCookie, deleteCookie } from 'cookies-next'

export default async function handler(req, res) {
  const { method, body } = req

  let headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  let response = ''
  let data = ''

  try {
    switch (method) {
      case 'POST':
        // Auth user
        response = await fetch(`${process.env.API_URL}/v1/auth/sign_in`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body),
        })

        data = await response.json()

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

        break
      case 'DELETE':
        const session = JSON.parse(getCookie('session', { req, res }))
        // Delete user session
        headers.set('uid', session.uid)
        headers.set('access-token', session.accessToken)
        headers.set('client', session.client)

        response = await fetch(`${process.env.API_URL}/v1/auth/sign_out`, {
          method: 'DELETE',
          headers: headers,
        })

        data = await response.json()

        if ([200, 201].includes(response.status)) {
          deleteCookie('session', { req, res })
          res.status(200).json(data)
          return
        }

        break
      default:
        res.setHeader('Allow', ['POST', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }

    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

  res.end()
}
