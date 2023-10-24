/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { IsAdmin, PaginationObject } from './common'
import type { Scalars, UserInput } from './graphql'
import type { GetUsers } from '@/lib/api/modules'

export type UserInputs = Omit<
  UserInput,
  | 'id'
  | 'userProjectsAttributes'
  | 'invitationToken'
  | 'password'
  | 'passwordConfirmation'
>
export type UserFormComponent = FC<{
  id?: Scalars['ID']
}>

export type AllowedUser = PaginationObject<GetUsers> &
  IsAdmin & {
    userProjectId?: Scalars['ID']
  }
