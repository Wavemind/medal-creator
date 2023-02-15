export type EmailInput = {
  email: string
}

export type PasswordInput = {
  password: string
}

export type SessionInputs = EmailInput & PasswordInput

export type Session = EmailInput & {
  role: string
  userId: number
  challenge?: string
}

export type SessionLogout = {
  success: boolean
}

export type PasswordInputs = PasswordInput & {
  passwordConfirmation: string
}
