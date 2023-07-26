/**
 * The external imports
 */
import { useState } from 'react'

/**
 * The internal imports
 */
import type { AlertDialog, OverlayHook } from '@/types'

// Custom hook that manages the modal state and content
export const useAlertDialog = (): OverlayHook<AlertDialog> => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<AlertDialog>({
    title: '',
    content: '',
    action: () => undefined,
  })

  /**
   * Sets the modal content to the incoming JSX component and opens the modal
   * @param {*} content JSX component
   */
  const open = ({ title, content, action }: AlertDialog): void => {
    setIsOpen(true)
    if (content) {
      setContent({ title, content, action })
    }
  }

  /**
   * Closes the modal
   */
  const close = (): void => {
    setIsOpen(false)
  }

  return {
    isOpen,
    open,
    close,
    content,
  }
}
