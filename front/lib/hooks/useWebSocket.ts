/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { WebSocketContext } from '@/lib/contexts'
import type { WebSocketContextType } from '@/types'

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext)

  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}
