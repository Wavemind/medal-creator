export type SessionInputs = {
  email: string
  password: string
}

export type Session = {
  email: string
  role: string
  userId: number
  challenge?: string
}

export type SessionLogout = {
  success: boolean
}

export type PasswordInputs = {
  password: string
  passwordConfirmation: string
}
