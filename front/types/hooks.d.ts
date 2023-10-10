/**
 * The external imports
 */
import type { ReactElement } from 'react'

export type Modal = {
  title?: string
  content: ReactElement | null
  size?: string
}

export type Drawer = {
  title?: string
  content: ReactElement | null
}

export type AlertDialog = {
  title: string
  content: string
  action: () => void
}

export type OverlayHook<T> =
  | {
      isOpen: boolean
      open: (props: T) => void
      close: () => void
      content: T
    }
  | Record<string, never>

export type Toast = {
  message: string | ReactElement
  status: string
}

export type CustomQuery = Record<string, string>
