/**
 * The external imports
 */
import type { FC, ReactNode } from 'react'

/**
 * The internal imports
 */
import type { MenuOptions } from './common'

export type AuthLayoutComponent = FC<{
  children: ReactNode
  namespace: string
}>

export type DefaultLayoutComponent = FC<{
  children: ReactNode
  menuType?: keyof MenuOptions
  showSideBar?: boolean
}>
