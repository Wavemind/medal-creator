/**
 * The external imports
 */
import { useContext } from 'react'
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
import { ModalContext } from '../lib/contexts'

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    modalContent: { title, content, size },
  } = useContext(ModalContext)

  return (
    <ChakraModal
      scrollBehavior='inside'
      isOpen={isModalOpen}
      onClose={closeModal}
      size={size}
    >
      <ModalOverlay />
      <ModalContent data-cy='modal'>
        <ModalHeader textAlign='center'>{title}</ModalHeader>
        <ModalCloseButton data-cy='close_modal' />
        <ModalBody px={12} py={6}>
          {content}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
