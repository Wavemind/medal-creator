/**
 * The external imports
 */
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  const session = JSON.parse(getCookie('session', { req, res }))
  const { method, body } = req

  let headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  headers.set('uid', session.uid)
  headers.set('access-token', session.accessToken)
  headers.set('client', session.client)

  let response = ''
  let data = ''

  try {
    switch (method) {
      case 'GET':
        // response = await fetch(
        //   `${process.env.API_URL}/v1/webauthn/credentials`,
        //   {
        //     method: 'GET',
        //     headers: headers,
        //   }
        // )
        // data = await response.json()
        // if ([200, 201].includes(response.status)) {
        //   res.status(200).json(data)
        //   return
        // }
        break
      case 'POST':
        const { name, challenge, credential } = body
        response = await fetch(
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
        data = await response.json()
        if ([200, 201].includes(response.status)) {
          res.status(200).json(data)
          return
        }
        break
      case 'DELETE':
        const { id } = body
        response = await fetch(
          `${process.env.API_URL}/v1/webauthn/credentials/${id}`,
          {
            method: 'DELETE',
            headers: headers,
          }
        )
        data = await response.json()
        if ([200, 201].includes(response.status)) {
          res.status(200).json(data)
          return
        }
        break
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }

    res.status(response.status).send(data)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

  res.end()
}
