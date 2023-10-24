/**
 * The external imports
 */
import { type FC, type PropsWithChildren, useEffect, useState } from 'react'
import type { Cable } from 'actioncable'

/**
 * The internal imports
 */
import { WebSocketContext } from '@/lib/contexts'
import { useAppRouter } from '@/lib/hooks'

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isReceiving, setIsReceiving] = useState(false)
  const [elementId, setElementId] = useState<string | null>(null)
  // TODO : Check how we would do elapsed time for duplication.. if difficult remove it
  const [messages, setMessages] = useState<
    Array<{ message: string; elapsed_time: number }>
  >([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const {
    query: { projectId },
  } = useAppRouter()

  useEffect(() => {
    const actionCable: { cable?: Cable } = {}

    if (
      typeof window !== 'undefined' &&
      Object.keys(actionCable).length === 0
    ) {
      // Had to import the library this way cause in needs to be called only in the client part
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createConsumer } = require('@rails/actioncable')

      actionCable.cable = createConsumer(
        `${process.env.NEXT_PUBLIC_API_WS_URL}`
      )
      if (actionCable.cable) {
        actionCable.cable.subscriptions.create(
          {
            channel: 'JobStatusChannel',
            // TODO : Not enough for algo generation AND algo duplication
            id: projectId,
          },
          {
            received: (data: {
              message: string
              status: string
              element_id: number
              history: Array<{ message: string; elapsed_time: number }>
            }) => {
              if (
                data.status === 'starting' ||
                data.status === 'transmitting'
              ) {
                setIsReceiving(true)
                setIsSuccess(false)
                setIsError(false)
                setMessages(data.history)
                setError('')
              }

              if (data.status === 'finished') {
                setIsReceiving(false)
                setIsSuccess(true)
                setMessages(data.history)
                setError('')
              }

              if (data.status === 'error') {
                setIsReceiving(false)
                setIsError(true)
                setMessages(data.history.slice(0, data.history.length - 1))
                setError(data.history.at(-1)?.message || '')
              }

              setElementId(String(data.element_id))
            },
          }
        )
      }
    }
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        isReceiving,
        setIsReceiving,
        isSuccess,
        isError,
        messages,
        elementId,
        error,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export default WebSocketProvider
