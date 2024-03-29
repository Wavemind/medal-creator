/**
 * The external imports
 */
import { useEffect, useState } from 'react'

/**
 * The internal imports
 */
import { WebSocketContext } from '@/lib/contexts'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useActionCable } from '@/lib/hooks/useActionCable'
import { useChannel } from '@/lib/hooks/useChannel'
import type { WebSocketProviderType, WebSocketMessages } from '@/types'

const WebSocketProvider: WebSocketProviderType = ({
  children,
  channel,
  job,
}) => {
  const [isReceiving, setIsReceiving] = useState(false)
  const [elementId, setElementId] = useState<string | null>(null)
  const [messages, setMessages] = useState<WebSocketMessages>([])
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const { actionCable } = useActionCable()
  const { subscribe, connected, getCurrentJobInfo } = useChannel(actionCable)

  const {
    query: { projectId },
  } = useAppRouter()

  useEffect(() => {
    if (connected) {
      getCurrentJobInfo()
    }
  }, [connected])

  useEffect(() => {
    subscribe(
      {
        channel,
        job,
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
