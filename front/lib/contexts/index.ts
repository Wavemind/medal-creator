/**
 * The external imports
 */
import { createContext } from 'react'

/**
 * The internal imports
 */
import {
  AlertDialog,
  OverlayHook,
  Modal,
  Drawer,
  PaginationFilterContextType,
  FormulaContextType,
  ProjectContextType,
  DiagramContextType,
} from '@/types'

export const AlertDialogContext = createContext<OverlayHook<AlertDialog>>({})
export const ModalContext = createContext<OverlayHook<Modal>>({})
export const DrawerContext = createContext<OverlayHook<Drawer>>({})
export const PaginationFilterContext = createContext<
  PaginationFilterContextType<any | null> | undefined
>(undefined)
export const FormulaContext = createContext<FormulaContextType | undefined>(
  undefined
)
export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
)
export const DiagramContext = createContext<DiagramContextType | undefined>(
  undefined
)
