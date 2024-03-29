/**
 * The external imports
 */
import { useRef, FC } from 'react'
import { useTranslation } from 'next-i18next'
import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'

const AlertDialog: FC = () => {
  const cancelRef = useRef(null)
  const { t } = useTranslation('common')
  const {
    close,
    isOpen,
    content: { title, content, action },
  } = useAlertDialog()

  /**
   * Toggle action and close modal
   */
  const toggleAction = () => {
    action()
    close()
  }

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={close}
    >
      <AlertDialogOverlay>
        <AlertDialogContent data-testid='alert-dialog'>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{content}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              data-testid='dialog-cancel'
              variant='ghost'
              ref={cancelRef}
              onClick={close}
            >
              {t('cancel')}
            </Button>
            <Button
              data-testid='dialog-accept'
              variant='delete'
              onClick={toggleAction}
              ml={3}
            >
              {t('yes')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  )
}

export default AlertDialog
