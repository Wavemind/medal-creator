/**
 * The internal imports
 */
import { Modal, AlertDialog } from "./hooks"

export type AlertDialogContextType = {
  isAlertDialogOpen: boolean
  openAlertDialog: ({ title, content, action }: AlertDialog) => void
  closeAlertDialog: () => void
  modalContent: AlertDialog
}

export type ModalContextType = {
  isModalOpen: boolean
  openModal: ({ title, content, size }: Modal) => void
  closeModal: () => void
  modalContent: Modal
}
