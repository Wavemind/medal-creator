/**
 * The internal imports
 */
import type { UserProject } from './userProject'
import type { TableState } from './datatable'

export type UserInputs = {
  firstName: string
  lastName: string
  email: string
  role: string
}

export type User = UserInputs & {
  id: number
  lockedAt: Date
  userProjects: UserProject[]
}

export type UsersQuery = TableState & { projectId: number | null }
