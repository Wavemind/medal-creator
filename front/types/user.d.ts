/**
 * The internal imports
 */
import { UserProject } from "./userProject"

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
