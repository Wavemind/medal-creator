/**
 * The internal imports
 */
import type { UserProject } from './userProject'

export type UserInputs = {
  firstName: string
  lastName: string
  email: string
  // TODO : Correct the type in the create/update user mutations and the back
  role: string
}

export type User = UserInputs & {
  id: number
  lockedAt: Date
  userProjects: UserProject[]
}

export type UsersQuery = TableState & { projectId?: number | null }