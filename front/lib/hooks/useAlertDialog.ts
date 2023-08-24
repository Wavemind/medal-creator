/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { AlertDialogContext } from '@/lib/contexts'
import type { OverlayHook, AlertDialog } from '@/types'

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext) as OverlayHook<AlertDialog>

  if (!context) {
    throw new Error(
      'useAlertDialog must be used within PaginationFilterProvider'
    )
  }
  return context
}
