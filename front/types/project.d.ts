/**
 * The external imports
 */
import type { FC, Dispatch, SetStateAction } from 'react'

/**
 * The internal imports
 */
import type { StringIndexType } from './common'
import type { UserProject } from './userProject'
import type { AllowedUser } from './user'

export type ProjectInputs = {
  id: string
  name: string
  description: string
  consentManagement: boolean
  trackReferral: boolean
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
  villages: File | null
  languageId: string
  userProjectsAttributes: Partial<UserProject>[]
}

export type ProjectFormComponent = FC<{
  setAllowedUsers: Dispatch<SetStateAction<AllowedUser[]>>
  allowedUsers: AllowedUser[]
}>
