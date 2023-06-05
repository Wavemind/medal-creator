/**
 * The external imports
 */
import { useState } from 'react'

/**
 * The internal imports
 */
import type { Drawer } from '@/types'

// Custom hook that manages the drawer state and content
export const useDrawer = () => {
  const [isDrawerOpen, setIsOpen] = useState(false)
  const [drawerContent, setDrawerContent] = useState({} as Drawer)

  /**
   * Sets the drawer content to the incoming JSX component and opens the drawer
   * @param {*} content JSX component
   */
  const openDrawer = ({ title, content }: Drawer) => {
    setIsOpen(true)
    if (content) {
      setDrawerContent({ title, content })
    }
  }

  /**
   * Closes the drawer
   */
  const closeDrawer = () => {
    setIsOpen(false)
  }

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    drawerContent,
  }
}
