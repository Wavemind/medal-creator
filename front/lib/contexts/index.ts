/**
 * The external imports
 */
import { createContext } from 'react'

/**
 * The internal imports
 */
import {
  ModalContextType,
  AlertDialogContextType,
  DrawerContextType,
} from '@/types'

export const AlertDialogContext = createContext<AlertDialogContextType>(
  {} as AlertDialogContextType
)
export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType
)
export const DrawerContext = createContext<DrawerContextType>(
  {} as DrawerContextType
)
