/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { FormulaContext } from '@/lib/contexts'
import type { FormulaContextType } from '@/types'

export const useFormula = () => {
  const context = useContext(FormulaContext) as FormulaContextType

  if (!context) {
    throw new Error('useFormula must be used within FormulaProvider')
  }
  return context
}
