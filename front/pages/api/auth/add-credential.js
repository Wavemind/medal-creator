/**
 * The external imports
 */
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  const session = JSON.parse(getCookie('session', { req, res }))

  let headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  headers.set('uid', session.uid)
  headers.set('access-token', session.accessToken)
  headers.set('client', session.client)

  const { name, challenge, credential } = req.body

  try {
    const response = await fetch(
      `${process.env.API_URL}/v1/webauthn/credentials?name=${name}`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          challenge,
          credential,
        }),
      }
    )

    const data = await response.json()

    if ([200, 201].includes(response.status)) {
      res.status(200).json(data)
      return
    }

    res.status(response.status).send(data)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

  res.end()
}
