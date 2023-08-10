/**
 * The external imports
 */
import { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import AlertDialog from '@/components/alertDialog'
import { AlertDialogContext } from '@/lib/contexts'
import { useAlertDialog } from '@/lib/hooks'

const AlertDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const alertDialog = useAlertDialog()

  return (
    <AlertDialogContext.Provider value={alertDialog}>
      {children}
      <AlertDialog />
    </AlertDialogContext.Provider>
  )
}

export default AlertDialogProvider
