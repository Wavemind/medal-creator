/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { ModalContext } from '@/lib/contexts'
import type { OverlayHook, Modal } from '@/types'

export const useModal = () => {
  const context = useContext(ModalContext) as OverlayHook<Modal>

  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
