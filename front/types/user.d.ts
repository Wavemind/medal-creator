/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { IsAdmin } from './common'

export type UserFormComponent = FC<{
  id?: string
}>

export type AllowedUser = User &
  IsAdmin & {
    userProjectId?: number
  }
