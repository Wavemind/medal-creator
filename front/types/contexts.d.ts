/**
 * The internal imports
 */
import { Modal, Drawer, AlertDialog } from "./hooks"

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

export type DrawerContextType = {
  isDrawerOpen: boolean
  openDrawer: ({ title, content }: Drawer) => void
  closeDrawer: () => void
  drawerContent: Drawer
}
