/**
 * The external imports
 */
import { useState } from 'react'

// Custom hook that manages the modal state and content
export default () => {
  const [isOpenAlertDialog, setIsOpen] = useState(false)
  const [alertDialogContent, setAlertDialogContent] = useState('')

  /**
   * Sets the modal content to the incoming JSX component and opens the modal
   * @param {*} content JSX component
   */
  const openAlertDialog = (title, content, action) => {
    setIsOpen(true)
    if (content) {
      setAlertDialogContent({ title, content, action })
    }
  }

  /**
   * Closes the modal
   */
  const closeAlertDialog = () => {
    setIsOpen(false)
  }

  return {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  }
}
