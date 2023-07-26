/**
 * The external imports
 */
import { useState } from 'react'

/**
 * The internal imports
 */
import type { Modal, OverlayHook } from '@/types'

// Custom hook that manages the modal state and content
export const useModal = (): OverlayHook<Modal> => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<Modal>({
    title: '',
    content: '',
    size: '',
  })

  /**
   * Sets the modal content to the incoming JSX component and opens the modal
   * @param {*} content JSX component
   */
  const open = ({ title, content, size = 'xl' }: Modal) => {
    setIsOpen(true)
    if (content) {
      setContent({ title, content, size })
    }
  }

  /**
   * Closes the modal
   */
  const close = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    open,
    close,
    content,
  }
}
