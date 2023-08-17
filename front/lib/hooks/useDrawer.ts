/**
 * The external imports
 */
import { useState } from 'react'

/**
 * The internal imports
 */
import type { Drawer, OverlayHook } from '@/types'

// Custom hook that manages the drawer state and content
export const useDrawer = (): OverlayHook<Drawer> => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<Drawer>({ title: '', content: null })

  /**
   * Sets the drawer content to the incoming JSX component and opens the drawer
   * @param {*} content JSX component
   */
  const open = ({ title, content }: Drawer) => {
    setIsOpen(true)
    if (content) {
      setContent({ title, content })
    }
  }

  /**
   * Closes the drawer
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
