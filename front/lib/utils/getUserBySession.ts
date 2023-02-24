/**
 * The external imports
 */
import { getCookie, hasCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next/types'

/**
 * Type imports
 */
import { Session } from '@/types/session'

export default (
  req: NextApiRequest | undefined,
  res: NextApiResponse | undefined
) => {
  let session: Session = {} as Session
  if (hasCookie('session', { req, res })) {
    session = JSON.parse(getCookie('session', { req, res }) as string)
  }

  return session
}
