/**
 * The internal imports
 */
import { ProjectId, IsAdmin } from './common'

export type UserProject = IsAdmin &
  ProjectId & {
    id: number
    userId: number
    _destroy?: boolean
  }
