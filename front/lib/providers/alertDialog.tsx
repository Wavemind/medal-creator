/**
 * The external imports
 */
import { FC, PropsWithChildren, useState } from 'react'

/**
 * The internal imports
 */
import { AlertDialogContext } from '@/lib/contexts'
import AlertDialog from '@/components/alertDialog'
import type { AlertDialog as AlertDialogType } from '@/types'

const AlertDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<AlertDialogType>({
    title: '',
    content: '',
    action: () => undefined,
  })

  const open = ({ title, content, action }: AlertDialogType): void => {
    setIsOpen(true)
    if (content) {
      setContent({ title, content, action })
    }
  }

  const close = (): void => {
    setIsOpen(false)
  }

  return (
    <AlertDialogContext.Provider
      value={{
        isOpen,
        open,
        close,
        content,
      }}
    >
      {children}
      <AlertDialog />
    </AlertDialogContext.Provider>
  )
}

export default AlertDialogProvider
