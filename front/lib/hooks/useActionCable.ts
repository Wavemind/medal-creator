/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import type { Cable } from 'actioncable'

export function useActionCable(): { actionCable: Cable } {
  // Need to do it in client side
  const actionCable = useMemo(() => {
    if (typeof window !== 'undefined') {
      // Had to import the library this way cause in needs to be called only in the client part
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createConsumer } = require('@rails/actioncable')

      return createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}`)
    }
  }, [])

  useEffect(() => {
    return () => {
      actionCable.disconnect()
    }
  }, [])

  return {
    actionCable,
  }
}
