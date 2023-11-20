/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { DiagramContext } from '@/lib/contexts'

export const useDiagram = () => {
  const context = useContext(DiagramContext)

  if (!context) {
    throw new Error('useDiagram must be used within DiagramProvider')
  }
  return context
}
