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
import type {
  ProjectId,
  AlgorithmId,
  IsAdminOrClinician,
  Languages,
} from './common'
import type { AllowedUser } from './user'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppWithLayoutPage = AppProps & {
  Component: NextPageWithLayout
}

export type NewProjectPage = {
  hashStoreLanguage: Languages
}

export type EditProjectPage = ProjectId & {
  emergencyContentTranslations: Languages
  studyDescriptionTranslations: Languages
  previousAllowedUsers: AllowedUser[]
}

export type AlgorithmsPage = ProjectId & IsAdminOrClinician

export type LibraryPage = ProjectId & IsAdminOrClinician

export type AlgorithmPage = AlgorithmsPage & AlgorithmId & IsAdminOrClinician

export type CustomErrorPage = NextPage<ErrorProps>

export type ConsultationOrderPage = AlgorithmId & IsAdminOrClinician
