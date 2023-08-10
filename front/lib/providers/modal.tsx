/**
 * The external imports
 */
import { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import Modal from '@/components/modal'
import { ModalContext } from '@/lib/contexts'
import { useModal } from '@/lib/hooks'

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const modal = useModal()

  return (
    <ModalContext.Provider value={modal}>
      {children}
      <Modal />
    </ModalContext.Provider>
  )
}

export default ModalProvider
