/**
 * The external imports
 */
import 'i18next'

/**
 * The internal imports
 */
import type acceptInvitation from '@/public/locales/en/acceptInvitation.json'
import type account from '@/public/locales/en/account.json'
import type algorithms from '@/public/locales/en/algorithms.json'
import type common from '@/public/locales/en/common.json'
import type datatable from '@/public/locales/en/datatable.json'
import type decisionTrees from '@/public/locales/en/decisionTrees.json'
import type diagnoses from '@/public/locales/en/diagnoses.json'
import type forgotPassword from '@/public/locales/en/forgotPassword.json'
import type home from '@/public/locales/en/home.json'
import type newPassword from '@/public/locales/en/newPassword.json'
import type project from '@/public/locales/en/project.json'
import type projects from '@/public/locales/en/projects.json'
import type signin from '@/public/locales/en/signin.json'
import type submenu from '@/public/locales/en/submenu.json'
import type users from '@/public/locales/en/users.json'
import type validations from '@/public/locales/en/validations.json'
import type variables from '@/public/locales/en/variables.json'

interface I18nNamespaces {
  acceptInvitation: typeof acceptInvitation
  account: typeof account
  algorithms: typeof algorithms
  common: typeof common
  datatable: typeof datatable
  decisionTrees: typeof decisionTrees
  diagnoses: typeof diagnoses
  forgotPassword: typeof forgotPassword
  home: typeof home
  newPassword: typeof newPassword
  project: typeof project
  projects: typeof projects
  signin: typeof signin
  submenu: typeof submenu
  users: typeof users
  validations: typeof validations
  variables: typeof variables
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nNamespaces
  }
}
