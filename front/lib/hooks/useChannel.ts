/**
 * The external imports
 */
import { useEffect, useState, useRef } from 'react'
import type { Cable } from 'actioncable'

export function useChannel(actionCable: Cable) {
  const [connected, setConnected] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const channelRef = useRef<any | null>(null)

  useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [])

  const subscribe = (data: any, callbacks: any) => {
    const channel = actionCable.subscriptions.create(data, {
      received: (x: any) => {
        if (callbacks.received) callbacks.received(x)
      },
      initialized: () => {
        setSubscribed(true)
        if (callbacks.initialized) callbacks.initialized()
      },
      connected: () => {
        setConnected(true)
        if (callbacks.connected) callbacks.connected()
      },
      disconnected: () => {
        setConnected(false)
        if (callbacks.disconnected) callbacks.disconnected()
      },
    })
    channelRef.current = channel
  }

  const unsubscribe = () => {
    setSubscribed(false)

    if (channelRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      actionCable.subscriptions.remove(channelRef.current)
      channelRef.current = null
    }
  }

  const getCurrentJobInfo = () => {
    if (subscribed && !connected)
      throw new Error('useActionCable: not connected')
    if (!subscribed) throw new Error('useActionCable: not subscribed')
    try {
      console.log('Requesting current job info')
      channelRef.current?.perform('current_job_info')
    } catch {
      throw new Error('useActionCable: Unknown error')
    }
  }

  return {
    connected,
    subscribed,
    subscribe,
    unsubscribe,
    getCurrentJobInfo,
  }
}
