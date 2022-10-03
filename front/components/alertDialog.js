/**
 * The external imports
 */
import { useRef, useContext } from 'react'
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
import { AlertDialogContext } from '/lib/contexts'

const AlertDialog = () => {
  const cancelRef = useRef()
  const { t } = useTranslation('common')
  const {
    closeAlertDialog,
    isOpenAlertDialog,
    alertDialogContent: { title, content, action },
  } = useContext(AlertDialogContext)

  /**
   * Toggle action and close modal
   */
  const toggleAction = async () => {
    await action()
    closeAlertDialog()
  }

  return (
    <ChakraAlertDialog
      isOpen={isOpenAlertDialog}
      leastDestructiveRef={cancelRef}
      onClose={closeAlertDialog}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{content}</AlertDialogBody>

          <AlertDialogFooter>
            <Button variant='ghost' ref={cancelRef} onClick={closeAlertDialog}>
              {t('cancel')}
            </Button>
            <Button variant='delete' onClick={toggleAction} ml={3}>
              {t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  )
}

export default AlertDialog
