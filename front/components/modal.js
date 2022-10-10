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
    modalContent: { title, content },
  } = useContext(ModalContext)

  return (
    <ChakraModal isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={12} py={6}>{content}</ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
