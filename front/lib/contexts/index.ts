/**
 * The external imports
 */
import { createContext } from 'react'

/**
 * The internal imports
 */
import { ModalContextType, AlertDialogContextType } from '@/types/contexts'

export const AlertDialogContext = createContext<AlertDialogContextType>(
  {} as AlertDialogContextType
)
export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType
)