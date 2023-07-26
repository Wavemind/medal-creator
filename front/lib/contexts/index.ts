/**
 * The external imports
 */
import { createContext } from 'react'

/**
 * The internal imports
 */
import { AlertDialog, OverlayHook, Modal, Drawer } from '@/types'

export const AlertDialogContext = createContext<OverlayHook<AlertDialog>>({})
export const ModalContext = createContext<OverlayHook<Modal>>({})
export const DrawerContext = createContext<OverlayHook<Drawer>>({})
