/**
 * The external imports
 */
import { FC, useContext } from 'react'
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { DrawerContext } from '@/lib/contexts'
import { useModal } from '@/lib/hooks'

const Modal: FC = () => {
  const {
    isOpen: isModalOpen,
    close: closeModal,
    content: { title, content, size },
  } = useModal()

  const { isOpen: isDrawerOpen, close: closeDrawer } = useContext(DrawerContext)

  /**
   * Closes the modal, and the drawer if it is open
   */
  const handleClose = () => {
    if (isDrawerOpen) {
      closeDrawer()
    }
    closeModal()
  }

  return (
    <ChakraModal
      scrollBehavior='inside'
      isOpen={isModalOpen}
      onClose={handleClose}
      size={size}
    >
      <ModalOverlay />
      <ModalContent data-testid='modal'>
        {title && (
          <ModalHeader textAlign='center' fontSize='3xl' mt={4}>
            {title}
          </ModalHeader>
        )}
        <ModalCloseButton
          data-testid='close-modal'
          mt={1}
          mr={1}
          onClick={handleClose}
        />
        <ModalBody px={12} py={6} mt={title ? 0 : 6}>
          {content}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
