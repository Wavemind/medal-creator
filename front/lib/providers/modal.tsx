/**
 * The external imports
 */
import { FC, PropsWithChildren, useState } from 'react'

/**
 * The internal imports
 */
import Modal from '@/components/modal'
import { ModalContext } from '@/lib/contexts'
import type { Modal as ModalType } from '@/types'

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ModalType>({
    title: '',
    content: null,
    size: '',
  })

  const open = ({ title, content, size = 'xl' }: ModalType) => {
    setIsOpen(true)
    if (content) {
      setContent({ title, content, size })
    }
  }

  const close = () => {
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        open,
        close,
        content,
      }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  )
}

export default ModalProvider
