/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { IsAdmin, PaginationObject } from './common'
import type { Scalars } from './graphql'
import type { GetUsers } from '@/lib/api/modules'

export type UserFormComponent = FC<{
  id?: string
}>

export type AllowedUser = PaginationObject<GetUsers> &
  IsAdmin & {
    userProjectId?: Scalars['ID']
  }
