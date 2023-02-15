/**
 * The external imports
 */
import { useState } from 'react'

/**
 * The internal imports
 */
import type { Modal } from '@/types/hooks'

// Custom hook that manages the modal state and content
export default () => {
  const [isModalOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState({} as Modal)

  /**
   * Sets the modal content to the incoming JSX component and opens the modal
   * @param {*} content JSX component
   */
  const openModal = ({ title, content, size = 'lg' }: Modal) => {
    setIsOpen(true)
    if (content) {
      setModalContent({ title, content, size })
    }
  }

  /**
   * Closes the modal
   */
  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    modalContent,
  }
}
