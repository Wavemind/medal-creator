import { projectId } from './common'

export type UserProject = isAdmin &
  projectId & {
    id: number
    userId: number
    _destroy?: boolean
  }
