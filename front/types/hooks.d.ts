export type Modal = {
  title: string
  content: ReactElement
  size?: string
}

export type AlertDialog = {
  title: string
  content: string
  action: () => void
}

export type Toast = {
  message: string
  status: string
}
