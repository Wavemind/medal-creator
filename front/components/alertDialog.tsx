/**
 * The external imports
 */
import { useRef, useContext, FC } from 'react'
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
import { AlertDialogContext } from '@/lib/contexts'

const AlertDialog: FC = () => {
  const cancelRef = useRef(null)
  const { t } = useTranslation('common')
  const {
    close,
    isOpen,
    content: { title, content, action },
  } = useContext(AlertDialogContext)

  /**
   * Toggle action and close modal
   */
  const toggleAction = async () => {
    await action()
    close()
  }

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={close}
    >
      <AlertDialogOverlay>
        <AlertDialogContent data-cy='alert_dialog'>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{content}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              data-cy='dialog_cancel'
              variant='ghost'
              ref={cancelRef}
              onClick={close}
            >
              {t('cancel')}
            </Button>
            <Button
              data-cy='dialog_accept'
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
