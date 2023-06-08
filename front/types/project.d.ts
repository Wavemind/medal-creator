/**
 * The external imports
 */
import type { FC, Dispatch, SetStateAction } from 'react'

/**
 * The internal imports
 */
import type { AllowedUser } from './user'
import type { ProjectInput } from './graphql'

export type ProjectInputs = Omit<ProjectInput, 'id'> & {
  villages: File | null
}

export type ProjectFormComponent = FC<{
  setAllowedUsers: Dispatch<SetStateAction<AllowedUser[]>>
  allowedUsers: AllowedUser[]
}>
