/**
 * The external imports
 */
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'
import type { AppProps } from 'next/app'

/**
 * The internal imports
 */
import type { projectId, StringIndexType, algorithmId } from './common'
import type { AllowedUser } from './user'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppWithLayoutPage = AppProps & {
  Component: NextPageWithLayout
}

export type NewProjectPage = {
  hashStoreLanguage: StringIndexType
}

export type EditProjecPage = projectId & {
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
  previousAllowedUsers: AllowedUser[]
}

export type AlgorithmsPage = projectId & {
  isAdminOrClinician: boolean
}

export type AlgorithmPage = AlgorithmsPage & algorithmId

export type CustomErrorPage = NextPage<ErrorProps>
