/**
 * The external imports
 */
import { useEffect, useState } from 'react'

/**
 * The internal imports
 */
import { WebSocketContext } from '@/lib/contexts'
import { useAppRouter, useActionCable, useChannel } from '@/lib/hooks'
import type { WebSocketProviderType } from '@/types'

const WebSocketProvider: WebSocketProviderType = ({ children, channel }) => {
  const [isReceiving, setIsReceiving] = useState(false)
  const [elementId, setElementId] = useState<string | null>(null)
  // TODO : Check how we would do elapsed time for duplication.. if difficult remove it
  const [messages, setMessages] = useState<
    Array<{ message: string; elapsed_time: number }>
  >([])
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const { actionCable } = useActionCable()
  const { subscribe } = useChannel(actionCable)

  const {
    query: { projectId },
  } = useAppRouter()

  useEffect(() => {
    subscribe(
      {
        channel: channel,
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
          if (data.status === 'starting') {
            setMessages([])
            setMessage('')
          }
          if (data.status === 'starting' || data.status === 'transmitting') {
            setMessage(data.message)
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
            setMessage('')
          }

          if (data.status === 'error') {
            setIsReceiving(false)
            setIsError(true)
            setMessages(data.history.slice(0, data.history.length - 1))
            setMessage('')
            setError(data.history.at(-1)?.message || '')
          }

          setElementId(String(data.element_id))
        },
      }
    )
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        isReceiving,
        setIsReceiving,
        isSuccess,
        isError,
        messages,
        message,
        elementId,
        error,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export default WebSocketProvider
