/**
 * The internal imports
 */
import { Modal, AlertDialog } from "./hooks"

export type AlertDialogContextType = {
  isOpenAlertDialog: boolean
  openAlertDialog: ({ title, content, action }: AlertDialog) => void
  closeAlertDialog: () => void
  alertDialogContent: AlertDialog
}

export type ModalContextType = {
  isModalOpen: boolean
  openModal: ({ title, content, size }: Modal) => void
  closeModal: () => void
  modalContent: Modal
}
