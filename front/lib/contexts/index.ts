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
} from '@/types'

// TODO: Align context
export const AlertDialogContext = createContext<OverlayHook<AlertDialog>>({})
export const ModalContext = createContext<OverlayHook<Modal>>({})
export const DrawerContext = createContext<OverlayHook<Drawer>>({})
export const PaginationFilterContext = createContext<
  PaginationFilterContextType<any | null> | undefined
>(undefined)
