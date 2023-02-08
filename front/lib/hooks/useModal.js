/**
 * The external imports
 */
import { useState } from 'react'

// Custom hook that manages the modal state and content
export default () => {
  const [isModalOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')

  /**
   * Sets the modal content to the incoming JSX component and opens the modal
   * @param {*} content JSX component
   */
  const openModal = ({ title, content, size = 'xl' }) => {
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
