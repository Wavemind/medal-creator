/**
 * The external imports
 */
import { useState } from 'react'

/**
 * The internal imports
 */
import type { AlertDialog } from '@/types'

// Custom hook that manages the modal state and content
export const useAlertDialog = () => {
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false)
  const [alertDialogContent, setAlertDialogContent] = useState<AlertDialog>({
    title: '',
    content: '',
    action: () => undefined,
  })

  /**
   * Sets the modal content to the incoming JSX component and opens the modal
   * @param {*} content JSX component
   */
  const openAlertDialog = ({ title, content, action }: AlertDialog): void => {
    setIsOpenAlertDialog(true)
    if (content) {
      setAlertDialogContent({ title, content, action })
    }
  }

  /**
   * Closes the modal
   */
  const closeAlertDialog = (): void => {
    setIsOpenAlertDialog(false)
  }

  return {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  }
}
