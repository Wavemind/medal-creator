/**
 * The internal imports
 */
import { Role } from '@/lib/config/constants'
import type { UserProject } from './userProject'
import type { TableState } from './datatable'
import type { PasswordInputs } from './session'

export type UserInputs = {
  firstName: string
  lastName: string
  email: string
  role: Role
  userProjectsAttributes?: Partial<UserProject>[]
}

export type User = UserInputs & {
  id: number
  lockedAt: Date
  userProjects: UserProject[]
}

export type UsersQuery = TableState & { projectId?: number | null }

export type AllowedUser = User & {
  userProjectId?: number
  isAdmin: boolean
}

export type AcceptInvitation = PasswordInputs & {
  invitationToken: string
}

export type UserCredentials = {
  id: number
  otpProvisioningUri: string
}
