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
import { ModalContext } from '../../lib/contexts'

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    modalContent: { title, content, size },
  } = useContext(ModalContext)

  // TODO : Move this into the modal folder ?
  return (
    <ChakraModal
      scrollBehavior='inside'
      isOpen={isModalOpen}
      onClose={closeModal}
      size={size}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center' fontSize='3xl' mt={4}>
          {title}
        </ModalHeader>
        <ModalCloseButton data-cy='close_modal' mt={4} mr={8} />
        <ModalBody px={12} py={6} data-cy='modal'>
          {content}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
