/**
 * The external imports
 */
import type { DefaultTFuncReturn } from 'i18next'

export type Modal = {
  title?: DefaultTFuncReturn
  content: ReactElement
  size?: string
}

export type Drawer = {
  title?: DefaultTFuncReturn
  content: ReactElement
}

export type AlertDialog = {
  title: DefaultTFuncReturn
  content: string
  action: () => void
}

export type Toast = {
  message: string
  status: string
}
