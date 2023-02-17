/**
 * The internal imports
 */
import type { UserProject } from './userProject'
import type { TableState } from './datatable'
import { PasswordInputs } from './session'

export type UserInputs = {
  firstName: string
  lastName: string
  email: string
  // TODO : Correct the type in the create/update user mutations and the back
  role: string
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
