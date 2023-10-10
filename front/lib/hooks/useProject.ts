/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { ProjectContext } from '@/lib/contexts'
import type { ProjectContextType } from '@/types'

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}
